import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TroubleshootingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center p-6 md:p-8">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Troubleshooting</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">Having issues? Here are some common problems and their solutions.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">1. Can't connect to chat</h2>
                  <p>
                    If you are having trouble connecting to the chat service, please check your internet connection. If your connection is stable, try clearing your browser's cache and cookies, or try using a different browser. If the problem persists, please contact our support team.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">2. I can't see the other person's messages</h2>
                  <p>
                    If you are connected to a chat but can't see the other person's messages, it might be a temporary network issue. Try refreshing the page. If that doesn't work, the other user may have disconnected.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">3. I was disconnected from the chat</h2>
                  <p>
                    Chats can be disconnected for a variety of reasons, including network issues or if the other user ends the chat. If you are disconnected, you can always start a new chat.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">4. I forgot my password</h2>
                  <p>
                    If you have forgotten your password, you can reset it by clicking the "Forgot your password?" link on the <a href="/login" className="text-primary hover:underline">Login page</a>. You will receive an email with instructions on how to reset your password.
                  </p>
                </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}