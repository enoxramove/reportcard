import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState } from "react";

const DemoRequest = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Demo Request Received!",
        description: "We'll contact you shortly to schedule your personalized demo.",
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="demo-section" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-border">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Request a Demo
              </CardTitle>
              <CardDescription className="text-lg">
                Experience the convenience and flexibility of our Report Card Generator. 
                Schedule a demo to discover how our system can support your school's reporting needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="school-name" className="text-sm font-medium text-foreground">
                      School Name *
                    </label>
                    <Input 
                      id="school-name"
                      required 
                      placeholder="Enter your school name"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                      Contact Name *
                    </label>
                    <Input 
                      id="contact-name"
                      required 
                      placeholder="Your full name"
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address *
                    </label>
                    <Input 
                      id="email"
                      type="email" 
                      required 
                      placeholder="your.email@school.edu"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <Input 
                      id="phone"
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Additional Information
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Tell us about your school's specific needs or requirements..."
                    className="min-h-32 resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Demo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DemoRequest;
