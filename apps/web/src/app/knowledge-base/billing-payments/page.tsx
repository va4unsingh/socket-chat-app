import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function BillingPaymentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center p-6 md:p-8">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Billing & Payments</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">Information about our billing and payment policies.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">1. Accepted Payment Methods</h2>
                  <p>
                    We accept all major credit cards, including Visa, Mastercard, and American Express. We also accept payments through PayPal and Google Pay.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">2. Subscription Billing</h2>
                  <p>
                    Our premium services are offered on a subscription basis. Subscriptions are billed in advance on a monthly or yearly basis, depending on the plan you choose. Your subscription will automatically renew at the end of each billing cycle.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">3. How to Cancel Your Subscription</h2>
                  <p>
                    You can cancel your subscription at any time from your account settings. If you cancel your subscription, you will continue to have access to the premium features until the end of your current billing period. You will not be charged for the next billing cycle.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">4. Refunds</h2>
                  <p>
                    We offer a 30-day money-back guarantee for initial purchases of our yearly subscription plans. For more information, please see our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a>.
                  </p>
                </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}