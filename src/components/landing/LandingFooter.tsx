import { BookOpen } from "lucide-react";

const LandingFooter = () => (
  <footer className="border-t py-12">
    <div className="container-wide">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">VocabIELTS</span>
        </div>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">About</a>
          <a href="#" className="hover:text-foreground transition-colors">FAQ</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        </nav>

        <p className="text-xs text-muted-foreground">© 2026 VocabIELTS. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
