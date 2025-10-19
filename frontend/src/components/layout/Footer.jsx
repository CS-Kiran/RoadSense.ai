import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                Rs
              </div>
              <span className="font-bold">RoadSense.ai</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bridging citizens and government for better road infrastructure.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Features</a></li>
              <li><a href="#" className="hover:text-foreground">How It Works</a></li>
              <li><a href="#" className="hover:text-foreground">Public Map</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold">Get Started</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Citizen Portal</a></li>
              <li><a href="#" className="hover:text-foreground">Official Login</a></li>
              <li><a href="#" className="hover:text-foreground">Admin Portal</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center text-sm text-muted-foreground">
          © 2025 RoadSense.ai. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
