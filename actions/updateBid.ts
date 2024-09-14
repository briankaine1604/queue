"use server";
import { bidSchema } from "@/components/bid/bid-form";
import { firestore } from "@/firebase/db"; // Import Firestore
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Firestore functions
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

type formValues = z.input<typeof bidSchema>;

export async function submitBid(data: formValues) {
  const { userId } = auth(); // Very important make sure the user is logged in if not they will bw able to use POST MAN or one random stuff to write post request to your database

  if (!userId) {
    return { error: "Unauthenticated!" };
  }

  const { bid_amount } = data;

  try {
    // Reference the 'bids' collection in Firestore
    const bidRef = collection(firestore, "bids");

    // Store the bid data in Firestore with a Firestore timestamp
    await addDoc(bidRef, {
      userId,
      bid_amount,
      createdAt: Timestamp.now(), // Use Firestore's Timestamp for better readability
    });

    console.log("Bid placed successfully!");
    return { success: "Bid placed" };
  } catch (error) {
    console.error("Error placing bid: ", error);
    return { error: "Failed to place bid" };
  }
}
