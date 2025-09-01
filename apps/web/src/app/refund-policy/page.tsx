import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center p-6 md:p-8">
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Refund Policy</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-2">Last updated: September 2, 2025</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
                <p>
                  We want you to be satisfied with our services. This policy outlines our refund process for our paid subscription plans.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">30-Day Money-Back Guarantee</h2>
                <p>
                  We offer a 30-day money-back guarantee for initial purchases of our yearly subscription plans. If you are not satisfied with our service for any reason, you can request a full refund within 30 days of your first payment.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Monthly Subscriptions</h2>
                <p>
                  For monthly subscriptions, we do not offer refunds for partial months or for months already paid. However, you can cancel your subscription at any time to avoid future charges.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request a Refund</h2>
                <p>
                  To request a refund, please contact our support team through the <Link href="/support" className="text-primary hover:underline">Support page</Link> with your purchase details. Refunds will be processed to the original payment method within 5-10 business days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellations</h2>
                <p>
                  You can cancel your subscription at any time from your account settings. Your access to premium features will continue until the end of your current billing period, and you will not be charged again. We do not provide prorated refunds for cancellations.
                </p>
              </section>

              <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                  <p>
                    If you have any questions about our Refund Policy, please <Link href="/support" className="text-primary hover:underline">contact us</Link>.
                  </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}