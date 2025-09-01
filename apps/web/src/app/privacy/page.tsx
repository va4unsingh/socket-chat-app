
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 md:py-24 lg:py-32 bg-background/95">
        <div className="container px-4 md:px-6">
           <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-lg border-primary/20">
             <CardHeader className="text-center p-6 md:p-8">
                <CardTitle className="text-3xl md:text-4xl font-bold">Privacy Policy</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">Last updated: July 28, 2024</CardDescription>
             </CardHeader>
             <Separator />
             <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
                <p className="mb-6">
                Welcome to WhisperLink. Your privacy is critically important to us. This Privacy Policy outlines how we collect, use, and protect your information.
                </p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                  <h3 className="text-xl font-semibold text-foreground mb-3">a. Information You Provide</h3>
                  <p className="mb-4">
                    For our free, anonymous chat service, we do not require you to create an account or provide any personally identifiable information (PII). For users who choose to sign up for an account to access premium features, we collect your email address and payment information.
                  </p>
                  <h3 className="text-xl font-semibold text-foreground mb-3">b. Chat Content</h3>
                  <p className="mb-4">
                    Your chat messages are transmitted through our servers but are not stored after the chat session is terminated by either party. We do not keep logs of conversations. The chat is ephemeral and disappears forever once the connection is closed. We use a temporary in-memory cache to facilitate message delivery during an active chat.
                  </p>
                  <h3 className="text-xl font-semibold text-foreground mb-3">c. Usage Data</h3>
                  <p>
                    We may collect non-personal information about your interaction with our service, such as session duration, features used, and crash reports. This data is aggregated and anonymized to help us improve our service.
                  </p>
                </section>


                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                  <p className="mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, maintain, and improve our services.</li>
                    <li>Process transactions and send you related information, including confirmations and invoices.</li>
                    <li>Respond to your comments, questions, and requests and provide customer service.</li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cookies and Tracking Technologies</h2>
                  <p>
                    We use temporary cookies to maintain your session, preferences, and authentication status. These cookies are essential for the functioning of the site and are not used for tracking purposes across other websites. You can instruct your browser to refuse all cookies, but some parts of our service may not function correctly.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
                  <p>
                    We implement a variety of security measures to maintain the safety of your personal information. All payment transactions are processed through a gateway provider and are not stored or processed on our servers. However, no online service can be 100% secure. We cannot guarantee the absolute security of your data.
                  </p>
                </section>
                
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">5. User Rights</h2>
                  <p>
                    If you have an account with us, you have the right to access, update, or delete your personal information. You can manage your account information from your profile settings. If you wish to permanently delete your account, please contact our support team.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">6. Policy Changes</h2>
                  <p>
                    Although most changes are likely to be minor, WhisperLink may change its Privacy Policy from time to time. We encourage visitors to frequently check this page for any changes. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.
                  </p>
                </section>
             </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}
