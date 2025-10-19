import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id='hero' className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <MapPin className="mr-2 h-4 w-4" />
            Crowdsourced Road Infrastructure Platform
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Report Road Issues,
            <span className="block text-primary">
              Drive Better Infrastructure
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Bridge the gap between citizens and government authorities with
            real-time road condition reporting, analytics, and predictive
            maintenance.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="group w-full sm:w-auto">
                Report an Issue
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/map">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Public Map
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
    </section>
  );
}
