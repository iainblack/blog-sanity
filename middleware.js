// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
    const url = request.nextUrl.clone();

    // Only redirect if we're not already on the "Coming Soon" page
    if (isComingSoon && !url.pathname.startsWith('/coming-soon')) {
        url.pathname = '/coming-soon';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
