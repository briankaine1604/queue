import { BidCard } from "@/components/bid/bidcard";
import { BidList } from "@/components/bid/bidList";
import { Gavel } from "lucide-react";
import { auth } from "@clerk/nextjs/server"; // Assuming you use Clerk for authentication

export default function Home() {
  const { userId } = auth(); // Hook to get the user's authentication status

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-full max-w-md border flex flex-col items-center justify-center px-4">
        <div className="text-xl font-bold flex gap-x-3 mt-5">
          Auction Page <Gavel />
        </div>
        <div className="text-sm text-gray-500 mb-2">
          {userId ? (
            <>Welcome, place your bid below</>
          ) : (
            <>Don’t forget to sign in, top right</>
          )}
        </div>
        <div className="w-full flex items-center flex-col">
          {/* Only show the BidCard if the user is signed in */}
          {userId ? (
            <BidCard userId={userId} />
          ) : (
            <div className="text-center mt-4 text-gray-500">
              Please sign in to place a bid.
            </div>
          )}
          <div className="mt-10 w-full">
            <BidList />
          </div>
        </div>
      </div>
    </div>
  );
}
