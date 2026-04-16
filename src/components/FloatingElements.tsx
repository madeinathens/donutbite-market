import { AXIOM, FLOOR_DISPLAY, GENESIS_DATE } from "../config";

function getDays(): number {
  const genesis = new Date(GENESIS_DATE);
  const now = new Date();
  const diff =
    Math.ceil(
      Math.abs(now.getTime() - genesis.getTime()) / (1000 * 60 * 60 * 24),
    ) - 1;
  return diff >= 0 ? diff : 0;
}

export default function FloatingElements() {
  const days = getDays();

  return (
    <>
      {/* x⁰ = 1 — floating δεξιά */}
      <div
        style={{
          position: "fixed",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9999,
          textAlign: "center",
          fontFamily: "'Space Mono', monospace",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#e8a826",
            textShadow: "0 0 16px rgba(232,168,38,0.6)",
            letterSpacing: "0.1em",
            marginBottom: "6px",
          }}
        >
          {AXIOM}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#9e9890",
            letterSpacing: "0.15em",
          }}
        >
          {FLOOR_DISPLAY}
        </div>
      </div>

      {/* Day Counter — κάτω κέντρο */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.3em",
          color: "#6b665f",
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        DAY <span style={{ color: "#e8a826" }}>{days.toLocaleString()}</span> •
        01.01.2012
      </div>
    </>
  );
}
