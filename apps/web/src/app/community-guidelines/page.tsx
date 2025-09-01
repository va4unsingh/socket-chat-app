
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CommunityGuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 md:py-24 lg:py-32 bg-background/95">
        <div className="container px-4 md:px-6">
          <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-lg border-primary/20">
            <CardHeader className="text-center p-6 md:p-8">
                <CardTitle className="text-3xl md:text-4xl font-bold">Community Guidelines</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">Last updated: September 1, 2025</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
                <p className="mb-6">
                WhisperLink is a place for open and respectful conversation. To ensure a positive experience for everyone, we ask that you follow these guidelines.
                </p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Be Respectful</h2>
                  <p>
                    Treat others as you would like to be treated. Disagreements are
                    fine, but personal attacks, harassment, and rudeness are not.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">No Hate Speech or Harassment</h2>
                  <p>
                    This is a safe space. We have a zero-tolerance policy for content that promotes violence or hatred against individuals or groups based on race or ethnic origin, religion, disability, age, nationality, veteran status, sexual orientation, gender, gender identity, or any other characteristic that is associated with systemic discrimination or marginalization.
                  </p>
                </section>
                
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">No Illegal Activities</h2>
                  <p>
                      Do not use WhisperLink to conduct illegal activities or to promote dangerous and illegal acts. You may be reported to law enforcement.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Keep it Clean</h2>
                  <p>
                      While we support free expression, we do not permit sexually explicit content or content that is intended to be sexually gratifying.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Consequences</h2>
                  <p>
                    Violating these guidelines may result in a temporary or permanent
                    ban from our service. We reserve the right to remove any content
                    and to terminate user access at our discretion.
                  </p>
                </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
