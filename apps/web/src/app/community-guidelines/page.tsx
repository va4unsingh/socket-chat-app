import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CommunityGuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center p-6 md:p-8">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Community Guidelines</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">Last updated: September 2, 2025</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 md:p-8 text-lg leading-relaxed text-muted-foreground">
                <p className="mb-6">
                Welcome to WhisperLink! Our goal is to create a safe and welcoming environment for everyone. To ensure a positive experience for all users, we require that you follow these guidelines. 
                </p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">1. Be Respectful and Kind</h2>
                  <p>
                    Treat everyone with respect. Healthy debates are natural, but kindness is required. Personal attacks, harassment, bullying, and any form of intimidation are strictly prohibited. Do not threaten, harass, or bully anyone.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">2. No Hate Speech</h2>
                  <p>
                    We have a zero-tolerance policy for hate speech. Content that promotes violence or hatred against individuals or groups based on race, ethnic origin, religion, disability, age, nationality, veteran status, sexual orientation, gender, gender identity, or any other characteristic associated with systemic discrimination or marginalization is not allowed.
                  </p>
                </section>
                
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">3. No Illegal or Dangerous Content</h2>
                  <p>
                      Do not use our service to conduct illegal activities or to promote dangerous and illegal acts. This includes, but is not limited to, buying or selling illegal drugs, weapons, or other illicit goods. You may be reported to law enforcement.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">4. No Sexually Explicit Content</h2>
                  <p>
                      We do not permit sexually explicit content, including pornography, nudity, or content that is intended to be sexually gratifying. This includes sharing links to external sites that contain such content.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">5. Protect Your Privacy</h2>
                  <p>
                    Do not share any personal information that you are not comfortable with being public. This includes your full name, address, phone number, and financial information. Be cautious about what you share with others.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Consequences for Violations</h2>
                  <p>
                    Violating these guidelines may result in a warning, a temporary suspension, or a permanent ban from our service. We reserve the right to remove any content and to terminate user access at our discretion.
                  </p>
                </section>

                <p className="text-center text-muted-foreground">
                  Thank you for being a part of our community and helping us keep it safe and welcoming for everyone.
                </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}