import type { ReactNode } from "react";
import FloatingElements from "./FloatingElements";
import Logo from "./Logo";
import ConnectButton from "./ConnectButton";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--void)",
        color: "var(--chalk)",
        fontFamily: "'Space Mono', monospace",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Button για το HTML αριστούργημα */}
          <a
            href="https://aed.madeinathens.eth.limo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              padding: "8px 16px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "var(--chalk-dim)",
              textDecoration: "none",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "var(--amber-dim)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--amber)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "var(--border)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--chalk-dim)";
            }}
          >
            🜁 GENESIS
          </a>
          <ConnectButton />
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          padding: "40px 32px 100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </main>

      <FloatingElements />
    </div>
  );
}
