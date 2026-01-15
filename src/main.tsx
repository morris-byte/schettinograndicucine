import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initGTM, initGA4, initFacebookPixel } from "./config/analytics";

// Initialize analytics as early as possible
if (typeof window !== 'undefined') {
  // Initialize in order: GTM first, then GA4, then Facebook Pixel
  initGTM();
  initGA4();
  initFacebookPixel();
}

createRoot(document.getElementById("root")!).render(<App />);
