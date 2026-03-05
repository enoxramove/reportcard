import { FileEdit, School, Users, BarChart3, FileOutput, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileEdit,
    title: "Customizable Templates",
    description: "Edit grades, subjects, marks, and remarks with comments from head teacher and class teacher."
  },
  {
    icon: School,
    title: "School Branding",
    description: "Personalize report cards with your school's logo, name, and details."
  },
  {
    icon: Users,
    title: "Student Profiles",
    description: "Manage student information, including names, classes, and academic records."
  },
  {
    icon: BarChart3,
    title: "Grade Management",
    description: "Easily input and edit grades, marks, and comments for each subject."
  },
  {
    icon: FileOutput,
    title: "PDF Generation",
    description: "Automatically generate report cards in PDF format, ready for printing or digital sharing."
  },
  {
    icon: Palette,
    title: "White Label",
    description: "Use our system under your school's brand, ensuring a seamless experience."
  }
];

const Features = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional, personalized report cards
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-card to-card/50"
            >
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
