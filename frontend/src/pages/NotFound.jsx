import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, MapPin, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5 p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.2 
          }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative bg-primary/10 p-8 rounded-full">
              <MapPin className="h-24 w-24 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Error Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-3 inline-flex items-center rounded-full bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            Error 404
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Lost Your Way?
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            We couldn't find the road you're looking for. Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/map">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <MapPin className="h-4 w-4" />
                View Map
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t"
        >
          <p className="text-sm text-muted-foreground mb-3">
            Need help?
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/about" className="text-primary hover:underline">
              About
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/register/citizen" className="text-primary hover:underline">
              Report Issue
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
