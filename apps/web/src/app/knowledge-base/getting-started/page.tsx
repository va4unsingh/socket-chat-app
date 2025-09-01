import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function GettingStartedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center p-6 md:p-8">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Getting Started</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">Welcome to WhisperLink! Here's how to get started.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">1. Starting a Chat</h2>
                  <p>
                    To start a chat, simply navigate to the home page and click the "Start Chatting Now" button. You will be instantly and randomly connected with another user. No account is required to use the free chat feature.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">2. Creating an Account</h2>
                  <p>
                    While you can chat anonymously without an account, signing up gives you access to more features. To create an account, click the "Sign Up" button on the top right of the page. You can sign up using your email address or your Google account.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">3. Your Profile</h2>
                  <p>
                    Once you have an account, you can set up your profile. You can add a profile picture, a username, and a short bio. This information will be visible to other users, so be mindful of what you share.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">4. Premium Features</h2>
                  <p>
                    We offer a Pro plan with premium features like advanced filters, priority matching, and more. You can learn more about our premium features on the <a href="/pricing" className="text-primary hover:underline">Pricing page</a>.
                  </p>
                </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}