import { Network } from "lucide-react";

interface LandingFooterProps {
  translations: any;
}

export const LandingFooter = ({ translations: t }: LandingFooterProps) => {
  return (
    <footer className="footer-container flex-col flex-center">
      <div className="flex-center" style={{ gap: "0.5rem" }}>
        <Network size={20} color="var(--primary)" />
        <span className="footer-logo-text">Carthos<span className="logo-ai">AI</span></span>
      </div>
      <p className="footer-description">{t.footer_text}</p>
      <p className="footer-copyright">
        © 2026 CarthosAI Neural Engine. Made with passion.
      </p>
    </footer>
  );
};
