import { firestore } from "@/firebase/db";
import { BidData } from "@/types";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export function getAllBids(setBids: (bids: BidData[]) => void) {
  try {
    const bidRef = collection(firestore, "bids");

    const bidsQuery = query(
      bidRef,
      orderBy("bid_amount", "desc"),
      orderBy("createdAt", "asc")
    );
    console.log("bidquery", bidsQuery);

    // Real-time snapshot listener
    const unsubscribe = onSnapshot(bidsQuery, (snapshot) => {
      const bids = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: data.userId,
          username: data.username,
          bid_amount: data.bid_amount,
          createdAt: data.createdAt.toDate(), // Convert Firestore timestamp to JS Date
        };
      });
      console.log(bids);

      setBids(bids);
    });

    return unsubscribe; // Immediately return the unsubscribe function
  } catch (error) {
    console.error("Error fetching real-time bids: ", error);
    throw new Error("Failed to fetch bids");
  }
}
