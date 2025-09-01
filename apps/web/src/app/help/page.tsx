
import { Header } from '@/components/header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const faqs = [
  {
    question: 'How do I start a chat?',
    answer:
      'Simply click the "Start Chatting Now" button on the home page or navigate to the Chat page. We will instantly connect you with a random stranger.',
  },
  {
    question: 'Is my chat truly anonymous?',
    answer:
      'Yes. We do not ask for any personal information. You are not required to create a profile, and your conversations are not stored on our servers.',
  },
  {
    question: 'How do I end a chat?',
    answer:
      'You can end a chat at any time by clicking the "End Chat" button. Once you disconnect, the chat is gone forever.',
  },
  {
    question: 'What are the rules?',
    answer:
      'We expect all users to be respectful. Do not engage in any form of harassment, hate speech, or illegal activities. Please read our Community Guidelines for more details. Users who violate these rules may be banned from the platform.',
  },
  {
    question: 'Is there a mobile app?',
    answer:
      'Currently, WhisperLink is only available as a web application. However, our website is fully responsive and works great on mobile browsers.',
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                How can we help?
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Have questions? We've got answers. If you can't find what you're
                looking for, feel free to reach out to our support team.
              </p>
              <div className="w-full max-w-lg relative">
                <Input type="search" placeholder="Search for answers..." className="h-12 pl-12" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="mx-auto max-w-4xl mt-16">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card border-border/50 rounded-lg px-6">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
