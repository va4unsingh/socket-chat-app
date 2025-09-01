
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 md:py-24 lg:py-32 bg-background/95">
        <div className="container px-4 md:px-6">
          <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-lg border-primary/20">
            <CardHeader className="text-center p-6 md:p-8">
              <CardTitle className="text-3xl md:text-4xl font-bold">Refund Policy</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-2">Last updated: September 1, 2025</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Free Services</h2>
                <p>
                  The core functionality of WhisperLink is provided free of charge. As there is no payment required for our basic services, there are no refunds applicable.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription Services (Pro Plan)</h2>
                <p>
                  For our paid subscription plans, such as the "Pro" tier, we offer a satisfaction guarantee. If you are not satisfied with the service, you may request a full refund within the first 14 days of your initial purchase.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request a Refund</h2>
                <p>
                  To request a refund, please contact our support team through the <a href="/support" className="text-primary hover:underline">Support page</a> with your purchase details. Refunds will be processed to the original payment method within 5-10 business days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellations</h2>
                <p>
                  You can cancel your subscription at any time. Your access to Pro features will continue until the end of your current billing period, and you will not be charged again. We do not provide prorated refunds for cancellations.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
