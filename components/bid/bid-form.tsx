"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Schema for form validation with a number type for bid_amount
export const bidSchema = z.object({
  bid_amount: z.coerce.number().min(1, "Bid amount must be at least 1"),
});

type Props = {
  onSubmit: (data: formValues) => void;
  isPending: boolean;
  initialData?: bidamount; // optional initial data
};
type bidamount = {
  bid_amount: number;
};
type formValues = z.infer<typeof bidSchema>;

export function BidForm({ onSubmit, isPending, initialData }: Props) {
  const form = useForm<formValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      bid_amount: initialData?.bid_amount ?? 0, // Ensure number type is used
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="bid_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bid amount</FormLabel>
              <FormControl>
                {/* Set input type to number */}
                <Input
                  type="number"
                  placeholder="Enter your bid amount"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter the amount for your bid</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Submit bid
        </Button>
      </form>
    </Form>
  );
}
