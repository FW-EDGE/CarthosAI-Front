import { Network } from "lucide-react";

interface LandingFooterProps {
  translations: any;
}

export const LandingFooter = ({ translations: t }: LandingFooterProps) => {
  return (
    <footer
      style={{
        background: "var(--surface-container-low)",
        padding: "4rem 6rem",
        borderTop: "1px solid var(--surface-container-highest)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Network size={20} color="var(--primary)" />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "var(--on-surface)",
          }}
        >
          CarthosAI
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.85rem",
          color: "var(--on-surface-var)",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        {t.footer_text}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.7rem",
          color: "var(--outline)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginTop: "2rem",
        }}
      >
        © 2026 CarthosAI Neural Engine. Made with passion.
      </p>
    </footer>
  );
};
