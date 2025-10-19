import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-16 text-center text-white shadow-xl sm:px-16">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Make a Difference?
          </h2>
          <p className="mb-8 text-lg text-white/90 sm:text-xl">
            Join thousands of citizens working together to improve road
            infrastructure
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/register/user">
              <Button size="lg" variant="secondary" className="group">
                <ArrowLeft className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                Get Started as Citizen
              </Button>
            </Link>
            <Link to="/register/official">
              <Button size="lg" variant="secondary" className="group">
                Register as Government Official
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
