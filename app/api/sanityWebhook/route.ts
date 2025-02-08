import { ServerClient } from "postmark";
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { db } from '@/components/Firebase/FirebaseConfig';
import { pages } from '@/components/utils';

const postmarkClient = new ServerClient(process.env.NEXT_PUBLIC_POSTMARK_API_KEY || '');

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
});

const parseBody = async (req: NextRequest) => {
  const raw = await req.arrayBuffer();
  const text = new TextDecoder().decode(raw);
  return JSON.parse(text);
};

const fetchPostDetails = async (postId: string) => {
  const query = `*[_type == "post" && _id == $postId][0]{
    _id,
    title,
    slug,
    pageId,
    excerpt,
    coverImage,
    date,
    author-> { name, email }
  }`;
  const params = { postId };
  return sanityClient.fetch(query, params);
};

const fetchSubscribers = async (pageId: string) => {
  const subscribersRef = db.collection('subscribers');
  const snapshot = await subscribersRef.where(`preferences.${pageId}`, '==', true).get();

  const subscribers: string[] = [];
  snapshot.forEach(doc => {
    subscribers.push(doc.data().email);
  });

  return subscribers;
};

const getEmailHtml = (post: any, email: string) => {
  const pageSlug = pages.find(page => page.contentType === 'post' && page.name === post.pageId)?.slug;
  const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${pageSlug}/posts/${post.slug.current}`;
  const managePreferencesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/manage-email-preferences?email=${email}`;

  const emailBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="background-color: #f7f7f7; padding: 20px; border-bottom: 1px solid #e0e0e0;">
      <h1 style="margin: 0; color: #65a765;">Lou Posted!</h1>
    </div>
    <div style="padding: 20px;">
      <h3 style="color: #333;">A new post has been created in ${post.pageId}:</h3>
      <h2 style="color: #333;">${post.title}</h2>
      ${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
      <a href="${postUrl}" style="display: inline-block; background-color: #65a765; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Read the full post</a>
      <p style="margin-top: 20px; font-size: 0.9em; color: #777;">You are receiving this email because you subscribed to notifications on our website.</p>
      <p style="font-size: 0.9em; color: #777;">No longer wish to receive these emails? <a href="${managePreferencesUrl}" style="color: #65a765;">manage your preferences</a> or <a href="{{{ pm:unsubscribe }}}" style="color: #65a765;">unsubscribe</a>.</p>
    </div>
    <div style="background-color: #f7f7f7; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 0.8em; text-align: center; color: #777;">&copy; ${new Date().getFullYear()} All rights reserved.</p>
    </div>
  </div>
  `;

  return emailBody;
};

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);

    console.log('Received sanity webhook:', body);

    const postId = body._id;
    if (!postId) {
      return NextResponse.json({ message: 'Invalid request: Missing post ID' }, { status: 400 });
    }

    const post = await fetchPostDetails(postId);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const subscribers = await fetchSubscribers(post.pageId);
    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers to notify' }, { status: 200 });
    }

    const emails = subscribers.map(email => ({
      To: email,
      From: process.env.NEXT_PUBLIC_VERIFIED_SENDER ?? '',
      Subject: `New Post from Lou's Blog: ${post.pageId}`,
      HtmlBody: getEmailHtml(post, email),
      MessageStream: 'broadcast',
    }));

    await postmarkClient.sendEmailBatch(emails);

    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
