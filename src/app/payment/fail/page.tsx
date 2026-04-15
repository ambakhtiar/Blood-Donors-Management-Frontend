import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Payment Failed - BloodLink",
};

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center ring-8 ring-red-50 dark:ring-red-900/30">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We were unable to process your payment. No money has been charged.
            Please try again or use a different payment method.
          </p>
        </div>

        {params.transactionId && (
          <div className="bg-muted/50 rounded-xl px-4 py-3 text-sm">
            <p className="text-muted-foreground text-xs mb-0.5">Transaction ID</p>
            <p className="font-mono font-semibold text-foreground">
              {params.transactionId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 bg-destructive hover:bg-destructive/90">
            <Link href="/feed">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
