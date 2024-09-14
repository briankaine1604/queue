import { Timestamp } from "firebase/firestore";

export interface BidData {
  userId: string;
  username: string; // Added username field
  bid_amount: number;
  createdAt: Timestamp; // Firestore's Timestamp type
}
