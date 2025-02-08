'server only';

import { db } from "../components/Firebase/FirebaseConfig";

export const addToSubscriberList = async (email: string, preferences: { [key: string]: boolean }) => {
  try {
    const subscribersRef = db.collection('subscribers');

    await subscribersRef.doc(email).set({
      email,
      preferences,
      subscribed: true,
    });

    return true;

  } catch (error) {
    console.error('Error subscribing user:', error);
    return false;
  };
};

export const updateSubscriberPreferences = async (email: string, preferences?: { [key: string]: boolean }) => {
  try {
    const subscribersRef = db.collection('subscribers');
    await subscribersRef.doc(email).update({
      preferences,
    });
    return true;
  } catch (error) {
    console.error('Error updating preferences:', error);
    return false;
  }
}

export const getSubscriberPreferences = async (email: string) => {
  try {
    const subscribersRef = db.collection('subscribers');
    const doc = await subscribersRef.doc(email).get();
    if (doc.exists) {
      return doc.data()?.preferences || {};
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return null;
  }
}

export const removeFromSubscriberList = async (email: string) => {
  try {
    const subscribersRef = db.collection('subscribers');
    await subscribersRef.doc(email).delete();

    return true;
  }
  catch (error) {
    console.error('Error unsubscribing user:', error);
    return false;
  }
};

export async function isOnSubscriberList(email: string) {
  try {
    const subscribersRef = db.collection('subscribers');
    const query = subscribersRef.where('email', '==', email);
    const querySnapshot = await query.get();

    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if email is subscribed:', error);
    return false;
  }
}