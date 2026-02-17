import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MessageCircle, Clock, HelpCircle, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { FaqItem } from "@shared/schema";

export default function ClientSupport() {
  const { data: faqs = [], isLoading } = useQuery<FaqItem[]>({
    queryKey: ["/api/faqs"],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold" data-testid="text-support-title">Help & Support</h1>
        <p className="text-muted-foreground">Get help with your store launch journey.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
              <Phone className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Call Us</h3>
            <p className="text-sm text-muted-foreground mb-4">Speak directly with your launch manager</p>
            <Button className="w-full bg-green-600 hover:bg-green-700" data-testid="button-call">
              <Phone className="h-4 w-4 mr-2" /> Call Support
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-4">Quick responses on WhatsApp chat</p>
            <Button className="w-full" variant="outline" data-testid="button-whatsapp">
              <MessageCircle className="h-4 w-4 mr-2" /> Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
              <Mail className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Email</h3>
            <p className="text-sm text-muted-foreground mb-4">For detailed queries and documents</p>
            <Button className="w-full" variant="outline" data-testid="button-email">
              <Mail className="h-4 w-4 mr-2" /> Send Email
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Support Hours</CardTitle>
          </div>
          <CardDescription>Our team is available during the following hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Monday - Saturday</span>
              <span className="text-muted-foreground">10:00 AM - 7:00 PM IST</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Sunday</span>
              <span className="text-muted-foreground">Closed</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            For urgent matters outside business hours, WhatsApp messages will be responded to on priority.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <CardTitle>Frequently Asked Questions</CardTitle>
          </div>
          <CardDescription>Quick answers to common questions about the Store Launch Program</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading FAQs...</p>
          ) : faqs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-empty-faqs">No FAQs available at the moment.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                  <AccordionTrigger className="text-left text-sm font-medium" data-testid={`faq-trigger-${faq.id}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground" data-testid={`faq-content-${faq.id}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Need something else?</h3>
            <p className="text-sm text-muted-foreground">Check our full program scope and included services.</p>
          </div>
          <Button variant="outline" className="shrink-0" data-testid="button-view-scope">
            <ExternalLink className="h-4 w-4 mr-2" /> View Program Scope
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
