import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, MessageSquare, Shield, Zap, ArrowRight, Star, Globe, Users, Heart, Twitter, Instagram } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

const partners = [
  { name: 'Global Connect', icon: Globe },
  { name: 'The People\'s Forum', icon: Users },
  { name: 'Open Dialogue', icon: MessageSquare },
  { name: 'Kindred Spirits', icon: Heart },
  { name: 'Community Hub', icon: Users },
  { name: 'Creative Corner', icon: Star }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-32 md:pt-40 md:pb-48 text-center bg-background bg-hero-lines">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,#c9e2ff20,transparent)] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-6 animate-fade-in">
              <Badge variant="secondary" className="py-2 px-4 rounded-full border-primary/30 bg-primary/10 text-primary font-medium shadow-sm">
                <Star className="w-4 h-4 mr-2" /> Connect Instantly, Chat Anonymously
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground py-2">
                Speak Your Mind, Anonymously.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                Jump into conversations with people from all over the world without revealing your identity. A safe space to share thoughts, stories, and ideas.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <Button asChild size="lg" className="text-lg h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-105">
                  <Link href="/chat">Start Chatting Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                 <Button asChild size="lg" variant="ghost" className="text-lg h-14 px-8 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4 pt-6">
                <div className="flex -space-x-2 overflow-hidden">
                  <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                    <AvatarImage src="https://picsum.photos/100" data-ai-hint="person face" />
                    <AvatarFallback>U1</AvatarFallback>
                  </Avatar>
                  <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                     <AvatarImage src="https://picsum.photos/101" data-ai-hint="person face"/>
                    <AvatarFallback>U2</AvatarFallback>
                  </Avatar>
                  <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                    <AvatarImage src="https://picsum.photos/102" data-ai-hint="person face"/>
                    <AvatarFallback>U3</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Join <strong>10,000+</strong> users chatting right now!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="w-full py-12 md:py-16 bg-transparent">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Trusted by communities worldwide
              </p>
              <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                  <div className="flex w-max animate-scroll">
                      {[...partners, ...partners].map((partner, index) => (
                          <div key={index} className="flex items-center justify-center gap-2 text-lg font-semibold text-muted-foreground mx-8 flex-shrink-0">
                              <partner.icon className="h-6 w-6" />
                              <span>{partner.name}</span>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section id="features" className="w-full py-20 md:py-32 bg-blue-50/5 bg-hero-lines">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16 fade-in">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                A New Way to Connect
              </h2>
              <p className="max-w-3xl text-muted-foreground md:text-xl">
                WhisperLink is more than just a chat app. It's a community built on respect, privacy, and genuine human connection.
              </p>
            </div>
            <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 fade-in">
              <Card className="bg-card/50 hover:border-accent/50 hover:bg-card/70 transition-all transform hover:-translate-y-2 shadow-sm hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 text-accent mb-4">
                    <Shield className="w-6 h-6" />
                  </div>
                  <CardTitle>Total Anonymity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your identity is safe. We don't ask for personal details, and chats are deleted the moment you disconnect.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 hover:border-accent/50 hover:bg-card/70 transition-all transform hover:-translate-y-2 shadow-sm hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm">
                <CardHeader>
                   <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 text-accent mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <CardTitle>Instant Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No waiting, no lobbies. Get connected with a random user instantly and start your conversation.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 hover:border-accent/50 hover:bg-card/70 transition-all transform hover:-translate-y-2 shadow-sm hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 text-accent mb-4">
                    <Heart className="w-6 h-6" />
                  </div>
                  <CardTitle>Interest-Based Pairing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add your interests to find and connect with people who share your passions for more meaningful chats.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="w-full py-20 md:py-32 bg-blue-50/5 bg-hero-lines">
          <div className="container grid items-center justify-center gap-16 px-4 md:px-6 lg:grid-cols-2 lg:gap-24 fade-in">
            <div className="space-y-4">
               <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm font-medium text-accent">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get Started in Seconds</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connecting with someone new has never been easier. Follow these simple steps to start your anonymous chat adventure.
                </p>
                 <ul className="grid gap-6 mt-6">
                  <li className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xl mr-4 shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-bold">Add Interests (Optional)</h3>
                      <p className="text-muted-foreground">Let us know what you love to talk about to find a better match.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xl mr-4 shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-bold">Start Your Search</h3>
                      <p className="text-muted-foreground">Click the button and we'll instantly connect you with a stranger.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xl mr-4 shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-bold">Chat Freely</h3>
                      <p className="text-muted-foreground">Enjoy the conversation! When you're done, simply disconnect.</p>
                    </div>
                  </li>
                </ul>
            </div>
            <div className="relative h-[550px] w-full flex items-center justify-center">
                 <Image
                  src="https://picsum.photos/600/800"
                  alt="Chat application screenshot"
                  data-ai-hint="app mockup"
                  className="rounded-xl shadow-2xl shadow-primary/20 rotate-3 transition-transform duration-300 hover:rotate-0"
                  width={400}
                  height={600}
                />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-20 md:py-32 bg-blue-50/5 bg-hero-lines">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16 fade-in">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Loved by People Worldwide
                    </h2>
                    <p className="max-w-3xl text-muted-foreground md:text-xl">
                        See what our users are saying about their experience on WhisperLink.
                    </p>
                </div>
                <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none md:grid-cols-2 lg:grid-cols-3 fade-in">
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/100/100?grayscale" data-ai-hint="person face" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Jane D.</p>
                                    <p className="text-sm text-muted-foreground">Creative Writer</p>
                                </div>
                            </div>
                            <blockquote className="italic text-muted-foreground">
                                "A breath of fresh air. It's so liberating to just talk to someone without all the pressure of social media profiles."
                            </blockquote>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/101/101" data-ai-hint="person face" />
                                    <AvatarFallback>MS</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Markus S.</p>
                                    <p className="text-sm text-muted-foreground">Student</p>
                                </div>
                            </div>
                            <blockquote className="italic text-muted-foreground">
                                "I was skeptical at first, but I've had some of the most genuine conversations here. Highly recommend for anyone feeling isolated."
                            </blockquote>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/102/102?grayscale" data-ai-hint="person face" />
                                    <AvatarFallback>AC</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Alex C.</p>
                                    <p className="text-sm text-muted-foreground">Explorer</p>
                                </div>
                            </div>
                            <blockquote className="italic text-muted-foreground">
                                "The simplicity is its greatest strength. No frills, just connection. It's beautiful."
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
        
        {/* FAQ Section */}
        <section className="w-full py-20 md:py-32 bg-blue-50/5 bg-hero-lines">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 fade-in">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Frequently Asked Questions
                </h2>
                <p className="max-w-3xl text-muted-foreground md:text-xl">
                    Have questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
                </p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4 fade-in">
              <AccordionItem value="item-1" className="bg-card/50 border-border/50 rounded-lg px-6 backdrop-blur-sm">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-left">Is my chat truly anonymous?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pt-2">Yes, absolutely. We don't ask for any personal information to start a chat. Your conversations are not stored and are permanently deleted when you disconnect.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-card/50 border-border/50 rounded-lg px-6 backdrop-blur-sm">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-left">How are people matched?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pt-2">Our system connects you with another random user who is also looking for a conversation. If you add interests, we try to match you with someone who shares those interests for a more engaging chat.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      
    </div>
  );
}
