
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 md:py-24 lg:py-32 bg-background/95">
        <div className="container px-4 md:px-6">
          <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-lg border-primary/20">
            <CardHeader className="text-center p-6 md:p-8">
              <CardTitle className="text-3xl md:text-4xl font-bold">Terms of Service</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-2">Last updated: July 28, 2024</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Your Agreement</h2>
                <p>
                  These Terms of Service ("Terms") govern your access to and use of WhisperLink's website and services ("Service"). This is a binding agreement. By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use of the Service</h2>
                <p>
                  You must be at least 18 years old to use WhisperLink. You are responsible for your conduct and for any content you provide. You agree to use the service in compliance with our Community Guidelines and all applicable local, state, national, and international laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Prohibited Conduct</h2>
                <p>
                  You may not use the Service to engage in harassment, hate speech, illegal activities, or to distribute spam. Impersonating others, sharing private information without consent, and any form of abusive behavior is strictly prohibited. We reserve the right to investigate and terminate users who violate these rules.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Subscription Services and Payments</h2>
                <h3 className="text-xl font-semibold text-foreground mb-3">a. Billing</h3>
                <p className="mb-4">
                  We offer certain enhanced features of the Services which you can purchase as a monthly subscription ("Subscription"). A description of features associated with Subscriptions is available on our <a href="/pricing" className="text-primary hover:underline">Pricing page</a>. When you purchase a Subscription, you must provide accurate and complete information for a valid payment method, such as a credit card, that you are authorized to use.
                </p>
                <h3 className="text-xl font-semibold text-foreground mb-3">b. Automatic Renewal</h3>
                <p className="mb-4">
                  Your Subscription will automatically renew on a monthly basis. You will be billed in advance on a recurring, periodic basis. You may cancel your Subscription at any time, but you must cancel before the renewal date to avoid being charged for the next billing cycle.
                </p>
                <h3 className="text-xl font-semibold text-foreground mb-3">c. Refunds</h3>
                <p>
                  Our refund policy is detailed on our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy page</a>. Generally, we offer a 14-day money-back guarantee for initial purchases. Refunds are not provided for recurring monthly payments.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Disclaimers and Limitation of Liability</h2>
                <p>
                  The Service is provided "as is" and "as available" without any warranties of any kind, express or implied. We do not guarantee that the service will always be safe, secure, uninterrupted, or error-free. To the fullest extent permitted by law, WhisperLink shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. We will provide notice of material changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </section>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
