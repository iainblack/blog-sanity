// firestoreFunctions.js
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";

const subscribersCollection = "subscribers";

export const subscribeUser = async (email: string, preferences: { [key: string]: boolean }) => {
  try {
    await setDoc(doc(db, subscribersCollection, email), { preferences });
    console.log("User subscribed successfully");
  } catch (error) {
    console.error("Error subscribing user: ", error);
  }
};

export const updateUserPreferences = async (email: string, preferences: { [key: string]: boolean }) => {
  try {
    const userDoc = doc(db, subscribersCollection, email);
    await updateDoc(userDoc, { preferences });
    console.log("User preferences updated successfully");
  } catch (error) {
    console.error("Error updating user preferences: ", error);
  }
};

export const unsubscribeUser = async (email: string) => {
  try {
    await deleteDoc(doc(db, subscribersCollection, email));
    console.log("User unsubscribed successfully");
  } catch (error) {
    console.error("Error unsubscribing user: ", error);
  }
};
