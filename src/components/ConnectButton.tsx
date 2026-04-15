import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

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

  return (
    <button
      onClick={() => connect({ connector: injected() })}
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
