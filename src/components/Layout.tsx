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
        background: "#050608",
        color: "#f0ece4",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <header
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid rgba(232,168,38,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo />
        <ConnectButton />
      </header>

      <main style={{ padding: "40px 32px 80px" }}>{children}</main>

      <FloatingElements />
    </div>
  );
}
