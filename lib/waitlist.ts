import { collection, addDoc, doc, updateDoc, serverTimestamp, getCountFromServer, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { sendWaitlistConfirmationEmail } from "./email";

export interface WaitlistEntry {
  email: string;
  source: "hero" | "bottom";
  note?: string;
}

/**
 * Dynamically fetches the total count of registered email entries from the 'waitlist' collection in Firestore.
 */
export async function fetchWaitlistCount(): Promise<number | null> {
  if (!isFirebaseConfigured) {
    return null;
  }

  try {
    const coll = collection(db, "waitlist");
    // Fast server aggregation query (counts all documents)
    const countSnapshot = await getCountFromServer(coll);
    return countSnapshot.data().count;
  } catch (err: any) {
    // Fallback to getDocs in case getCountFromServer isn't supported by the active rule set
    try {
      const coll = collection(db, "waitlist");
      const docsSnapshot = await getDocs(coll);
      return docsSnapshot.size;
    } catch (fallbackErr: any) {
      console.warn(
        "Could not fetch waitlist count from Firestore. If 'permission-denied', please add 'allow read: if true;' to your Firestore 'waitlist' rules in the Firebase console.",
        fallbackErr?.message || fallbackErr
      );
      return null;
    }
  }
}

/**
 * Adds an email to the 'waitlist' collection in Firestore
 * and triggers an automated confirmation email to the user.
 * Returns the document ID on success.
 */
export async function addWaitlistEntry(email: string, source: "hero" | "bottom"): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase();

  // Dispatch confirmation email asynchronously in background (non-blocking for instant sub-second UI feedback)
  sendWaitlistConfirmationEmail(normalizedEmail, source).catch((err) => {
    console.warn("Confirmation email dispatch warning:", err);
  });

  if (!isFirebaseConfigured) {
    console.info("Firebase is in demo mode (environment variables not yet configured).");
    return "demo-doc-id";
  }

  try {
    const docRef = await addDoc(collection(db, "waitlist"), {
      email: normalizedEmail,
      source,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding waitlist entry to Firebase:", error);
    throw error;
  }
}

/**
 * Updates an existing waitlist entry with an optional research note / feedback.
 */
export async function updateWaitlistNote(docId: string, note: string): Promise<void> {
  if (!isFirebaseConfigured || docId === "demo-doc-id") {
    console.info("Demo mode: note submitted:", note);
    return;
  }

  try {
    const docRef = doc(db, "waitlist", docId);
    await updateDoc(docRef, {
      note: note.trim(),
      noteUpdatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating waitlist note in Firebase:", error);
    throw error;
  }
}
