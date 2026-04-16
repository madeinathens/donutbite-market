import { useReadContract, useAccount } from "wagmi";
import {
  MARKET_CONTRACT,
  LADDER_STEPS,
  FLOOR_PRICE_DISPLAY,
  LADDER_TOTAL_DISPLAY,
} from "../config";
import BuyButton from "./BuyButton";
import DepositButton from "./DepositButton";

const MARKET_ABI = [
  {
    name: "totalActiveListings",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getActiveListings",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "holder", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "depositTime", type: "uint256" },
          { name: "listedPrice", type: "uint256" },
          { name: "active", type: "bool" },
        ],
      },
    ],
  },
] as const;

function getListingStatus(depositTime: bigint) {
  const now = Math.floor(Date.now() / 1000);
  const dep = Number(depositTime);
  return {
    isExpired: now > dep + 7 * 24 * 3600,
    inGrace: now <= dep + 48 * 3600,
    hoursLeft: Math.max(0, Math.floor((dep + 7 * 24 * 3600 - now) / 3600)),
  };
}

const sectionTitle = {
  fontSize: "9px",
  letterSpacing: "0.35em",
  color: "var(--amber)",
  textTransform: "uppercase" as const,
  marginBottom: "20px",
  paddingBottom: "12px",
  borderBottom: "1px solid var(--border-soft)",
};

export default function MarketPage() {
  const { isConnected } = useAccount();

  const { data: totalListings } = useReadContract({
    address: MARKET_CONTRACT as `0x${string}`,
    abi: MARKET_ABI,
    functionName: "totalActiveListings",
  });

  const { data: listings } = useReadContract({
    address: MARKET_CONTRACT as `0x${string}`,
    abi: MARKET_ABI,
    functionName: "getActiveListings",
  });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* ─── TITLE ─────────────────────────────────────── */}
      <div style={{ marginBottom: "48px" }}>
        <div
          style={{
            fontSize: "9px",
            letterSpacing: "0.4em",
            color: "rgba(232,168,38,0.6)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          RWA Mitotic Ladder · Base Mainnet
        </div>
        <h1
          style={{
            fontFamily: "'IM Fell English SC', serif",
            fontSize: "clamp(28px, 5vw, 48px)",
            color: "var(--chalk)",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Own Your Past
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "18px",
            color: "var(--chalk-dim)",
            lineHeight: 1.8,
            maxWidth: "560px",
          }}
        >
          Every consumed event is a Monetized Past Event (PCE).
          <br />
          Buy. List. Sell. The mitotic loop is absolute.
        </p>
      </div>

      {/* ─── STATS ─────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          border: "1px solid var(--border)",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Floor Price",
            value: `${FLOOR_PRICE_DISPLAY} USDC`,
            color: "var(--amber)",
          },
          {
            label: "Active Listings",
            value: totalListings !== undefined ? totalListings.toString() : "—",
            color: "var(--green)",
          },
          {
            label: "Ladder Total",
            value: `${LADDER_TOTAL_DISPLAY} USDC`,
            sub: `${LADDER_STEPS} steps`,
            color: "var(--amber)",
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              padding: "20px 24px",
              borderRight: i < 2 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                color: "var(--chalk-dim)",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: s.color,
              }}
            >
              {s.value}
            </div>
            {s.sub && (
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--chalk-dim)",
                  marginTop: "4px",
                }}
              >
                {s.sub}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── ACTIVE LISTINGS ───────────────────────────── */}
      <div
        style={{
          border: "1px solid var(--border)",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div style={sectionTitle}>Active PCE Events</div>

        {!listings || listings.length === 0 ? (
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "16px",
              color: "var(--chalk-dim)",
              padding: "20px 0",
            }}
          >
            No active listings. Be the first to deposit.
          </div>
        ) : (
          listings.map((l) => {
            const price = (Number(l.listedPrice) / 1_000_000).toFixed(2);
            const dep = new Date(Number(l.depositTime) * 1000);
            const { isExpired, inGrace, hoursLeft } = getListingStatus(
              l.depositTime,
            );

            return (
              <div
                key={l.tokenId.toString()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid var(--border-soft)",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ color: "var(--chalk)", marginBottom: "2px" }}>
                    Token #{l.tokenId.toString()}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--chalk-dim)" }}>
                    {l.holder.slice(0, 8)}...{l.holder.slice(-4)} ·{" "}
                    {dep.toLocaleDateString()}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "var(--amber)",
                  }}
                >
                  {price} USDC
                </div>

                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: isExpired
                      ? "var(--red)"
                      : inGrace
                        ? "var(--amber)"
                        : "var(--green)",
                  }}
                >
                  {isExpired
                    ? "EXPIRED"
                    : inGrace
                      ? "GRACE PERIOD"
                      : `ACTIVE · ${hoursLeft}h`}
                </div>

                {/* BuyButton — εμφανίζεται μόνο αν είναι συνδεδεμένος */}
                {isConnected && (
                  <BuyButton tokenId={l.tokenId} isExpired={isExpired} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ─── DEPOSIT — μόνο αν είναι συνδεδεμένος ─────── */}
      {isConnected && <DepositButton />}

      {/* ─── MESSAGE αν δεν είναι συνδεδεμένος ─────────── */}
      {!isConnected && (
        <div
          style={{
            border: "1px solid var(--border-soft)",
            padding: "24px",
            textAlign: "center",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "16px",
            color: "var(--chalk-dim)",
          }}
        >
          Connect your wallet to buy or deposit NFTs.
        </div>
      )}
    </div>
  );
}
