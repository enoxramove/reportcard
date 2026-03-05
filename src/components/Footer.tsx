const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Report Card Generator</h3>
            <p className="text-primary-foreground/80">
              Empowering educators, engaging students with professional reporting solutions.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#features" className="hover:text-primary-foreground transition-colors">Features</a></li>
              <li><a href="#benefits" className="hover:text-primary-foreground transition-colors">Benefits</a></li>
              <li><a href="#demo-section" className="hover:text-primary-foreground transition-colors">Request Demo</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Email: info@reportcardgen.com</li>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Report Card Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
