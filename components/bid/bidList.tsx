"use client";
import { Timestamp } from "firebase/firestore"; // Import Firestore Timestamp
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { BidData } from "@/types";
import { getAllBids } from "@/actions/getAllbid";
import { FormatCurrency } from "@/lib/utils";
import { format } from "date-fns";

// Format date using date-fns
const formatDate = (createdAt: Date | Timestamp) => {
  let date: Date;

  if (createdAt instanceof Timestamp) {
    // Firestore Timestamp case
    date = createdAt.toDate();
  } else {
    // If it's already a Date
    date = createdAt;
  }

  return format(date, "PPPpp"); // Use date-fns to format the date
};

export const BidList = () => {
  const [bids, setBids] = useState<BidData[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchBids = async () => {
      try {
        unsubscribe = await getAllBids(setBids);
      } catch (error) {
        console.error("Error fetching bids: ", error);
      }
    };

    fetchBids();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="p-4 bg-white border rounded shadow-md w-full">
      <h2 className="text-lg font-bold mb-4">Bid Queue</h2>
      <ul className="space-y-4">
        {bids.map((bid, index) => (
          <li
            key={bid.userId}
            className={`flex items-center p-4 rounded-lg shadow-md gap-x-5
              ${bid.userId === userId ? "bg-green-100" : "bg-gray-100"}`}
          >
            <div className="font-bold text-gray-600">#{index + 1}</div>
            <div className="flex flex-col">
              <div className="text-lg font-bold">{bid.username}</div>
              <div className="text-md text-gray-600 font-bold">
                {FormatCurrency(bid.bid_amount)}
              </div>
              <div className="text-xs text-gray-400">{bid.userId}</div>
              <div className="text-sm text-gray-500">
                {formatDate(bid.createdAt)} {/* Format and display the date */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
