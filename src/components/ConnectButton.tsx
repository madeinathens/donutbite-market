import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = "6ade73cf636a26265b5243cf9cf93f22";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            padding: "8px 16px",
            background: "rgba(45,224,122,0.1)",
            border: "1px solid rgba(45,224,122,0.3)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: "#2de07a",
          }}
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          style={{
            background: "transparent",
            border: "1px solid rgba(212,207,200,0.15)",
            padding: "8px 16px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: "#6b665f",
            cursor: "pointer",
          }}
        >
          DISCONNECT
        </button>
      </div>
    );
  }

  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  return (
    <button
      onClick={() => {
        if (isMobile) {
          connect({ connector: walletConnect({ projectId }) });
        } else {
          connect({ connector: injected() });
        }
      }}
      style={{
        background: "#e8a826",
        border: "none",
        padding: "10px 24px",
        fontFamily: "'Space Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.25em",
        fontWeight: "700",
        color: "#050608",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseOver={(e) => {
        (e.target as HTMLButtonElement).style.boxShadow =
          "0 0 24px rgba(232,168,38,0.4)";
      }}
      onMouseOut={(e) => {
        (e.target as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      CONNECT WALLET
    </button>
  );
}
