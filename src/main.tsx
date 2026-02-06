import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize font size from localStorage
const savedFontSize = localStorage.getItem('afedulight-font-size') || 'medium';
document.documentElement.classList.add(`font-${savedFontSize}`);

createRoot(document.getElementById("root")!).render(<App />);
