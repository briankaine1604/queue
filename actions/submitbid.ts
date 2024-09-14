"use server";
import { bidSchema } from "@/components/bid/bid-form";
import { firestore } from "@/firebase/db"; // Import Firestore
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
} from "firebase/firestore"; // Firestore functions
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";

type formValues = z.input<typeof bidSchema>;

export async function submitBid(data: formValues) {
  const { userId } = auth(); // Ensure the user is authenticated
  const usernamedetails = await currentUser();
  const username = usernamedetails?.fullName;

  if (!userId) {
    return { error: "Unauthenticated!" };
  }

  // Ensure bid_amount is a number
  const bid_amount = Number(data.bid_amount);

  try {
    const bidRef = collection(firestore, "bids");

    // Query Firestore to check if the user has already placed a bid
    const existingBidQuery = query(bidRef, where("userId", "==", userId));
    const existingBidSnapshot = await getDocs(existingBidQuery);

    if (!existingBidSnapshot.empty) {
      const existingBidDoc = existingBidSnapshot.docs[0];
      const existingBidId = existingBidDoc.id;

      // Update the existing bid with the new bid amount
      const bidDocRef = doc(firestore, "bids", existingBidId);
      await updateDoc(bidDocRef, {
        bid_amount: bid_amount, // Overwrite the existing bid amount
        updatedAt: Timestamp.now(),
      });

      console.log("Bid updated successfully!");
      return { success: "Bid updated" };
    } else {
      // If no bid exists, create a new one
      await addDoc(bidRef, {
        userId,
        username,
        bid_amount,
        createdAt: Timestamp.now(),
      });

      console.log("Bid placed successfully!");
      return { success: "Bid placed" };
    }
  } catch (error) {
    console.error("Error handling bid: ", error);
    return { error: "Failed to process bid" };
  }
}
