"use client";
import { useState, useEffect, useTransition } from "react";
import { BidForm, bidSchema } from "@/components/bid/bid-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { submitBid } from "@/actions/submitbid";
import { z } from "zod";
import { toast } from "sonner";
import { firestore } from "@/firebase/db";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { User } from "lucide-react";
import { FormatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";
import { startOfDay, endOfDay } from "date-fns"; // Import from date-fns

type Props = {
  userId: string;
  username?: string;
};

export const BidCard = ({ userId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [bidDetails, setBidDetails] = useState<{
    bid_amount: number;
    id: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const bidRef = collection(firestore, "bids");

    // Get the start and end of today
    const now = new Date();
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);

    // Modify query to check for bids from the current user and created today
    const existingBidQuery = query(
      bidRef,
      where("userId", "==", userId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday)
    );

    const unsubscribe = onSnapshot(existingBidQuery, (snapshot) => {
      if (!snapshot.empty) {
        const bidData = snapshot.docs[0].data();
        const bidId = snapshot.docs[0].id;
        setBidDetails({
          bid_amount: bidData.bid_amount,
          id: bidId,
          username: bidData.username,
        });
      } else {
        setBidDetails(null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const handleFormSubmit = (data: z.infer<typeof bidSchema>) => {
    startTransition(() => {
      submitBid(data).then((res) => {
        if (res.success) {
          toast.success(res.success);
        }
        if (res.error) {
          toast.error(res.error);
        }
      });
      setIsOpen(false);
    });
  };

  const handleCancelBid = async () => {
    if (bidDetails?.id) {
      try {
        const bidDocRef = doc(firestore, "bids", bidDetails.id);
        await deleteDoc(bidDocRef);
        toast.success("Bid canceled successfully!");
      } catch (error) {
        toast.error("Failed to cancel the bid");
        console.error("Error cancelling bid: ", error);
      }
    }
  };

  return (
    <div className="w-full max-w-md p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gray-200 rounded-full">
            <User className="text-gray-700 size-4" />
          </div>
          <section className="flex flex-col space-y-1">
            <div className="text-lg font-semibold">
              {bidDetails ? bidDetails.username : "XXXXX"}
            </div>
            <div className="text-gray-500 text-sm">
              {bidDetails ? (
                <>Bid: {FormatCurrency(bidDetails.bid_amount)}</>
              ) : (
                "No bid placed (Place bid to join the queue)"
              )}
            </div>
          </section>
        </div>
        <div className="flex flex-col items-center space-y-2">
          {bidDetails ? (
            <>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
                  Change bid
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <BidForm
                    onSubmit={handleFormSubmit}
                    isPending={isPending}
                    initialData={{ bid_amount: bidDetails.bid_amount }} // Pass number directly
                  />
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                onClick={handleCancelBid}
                className="px-4 py-2 text-sm"
              >
                Cancel bid
              </Button>
            </>
          ) : (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700">
                Place bid
              </DialogTrigger>
              <DialogContent className="bg-white">
                <BidForm
                  onSubmit={handleFormSubmit}
                  isPending={isPending}
                  initialData={{ bid_amount: 0 }} // Empty initial data as a number
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};
