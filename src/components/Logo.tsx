import { LOGO_URL, AUTHOR, SITE_URL } from "../config";

export default function Logo() {
  return (
    <a
      href={SITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
      }}
    >
      <img
        src={LOGO_URL}
        alt={AUTHOR}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid rgba(232,168,38,0.3)",
        }}
      />
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "#9e9890",
        }}
      >
        {AUTHOR}
      </span>
    </a>
  );
}
