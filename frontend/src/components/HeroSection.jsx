import { Button } from "./ui/button";
import { ArrowRight, Users, Code, Trophy } from "lucide-react";
import homeImage from "../assets/hero-collaboration.jpg";

function HeroSection() {
  return (
    <div className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-secondary/80 to-primary/90"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Collaborate.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-glow">
              Create.
            </span>
            <br />
            Succeed.
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
            Join thousands of students building amazing projects together. Find teammates,
            share skills, and turn your ideas into reality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Start Collaborating
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Discover Projects
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Active Students</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-white/80">Projects Launched</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
