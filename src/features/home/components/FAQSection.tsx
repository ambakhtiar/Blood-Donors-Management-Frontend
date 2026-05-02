"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who is eligible to donate blood?",
    answer: "Generally, any healthy adult between 18-65 years old weighing at least 50kg can donate blood. You should not have any infectious diseases and must wait at least 4 months between donations.",
  },
  {
    question: "Is the medical crowdfunding process transparent?",
    answer: "Yes. Every campaign is reviewed by our admin team and requires verified medical documents. Contributions are tracked and can be monitored by the donors and the campaign starter.",
  },
  {
    question: "How does the matching algorithm work?",
    answer: "Our system uses location data and blood group compatibility to find the best match. In emergencies, it prioritizes verified donors who have a high response rate and are closest to the hospital.",
  },
  {
    question: "Are hospitals on this platform verified?",
    answer: "Absolutely. Hospitals must go through a manual verification process by our Super Admin team. Once verified, they can record donations and verify donor records on the digital ledger.",
  },
  {
    question: "How can I volunteer for an organisation?",
    answer: "Organisations registered on our platform can post volunteer requests. You can find these in the organisation directory and apply directly through your user dashboard.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Common Questions</h2>
          <p className="text-muted-foreground">
            Everything you need to know about donation, eligibility, and how our platform supports you.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left font-bold hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
