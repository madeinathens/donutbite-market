import { useReadContract } from "wagmi";
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

function getListingStatus(depositTime: bigint): {
  isExpired: boolean;
  inGrace: boolean;
} {
  const now = Math.floor(Date.now() / 1000);
  const dep = Number(depositTime);
  return {
    isExpired: now > dep + 7 * 24 * 3600,
    inGrace: now <= dep + 48 * 3600,
  };
}

export default function MarketPage() {
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
      {/* Title */}
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
            color: "#f0ece4",
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
            color: "#9e9890",
            lineHeight: 1.8,
          }}
        >
          Every consumed event is a Monetized Past Event (PCE).
          <br />
          Buy. List. Sell. The mitotic loop is absolute.
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          border: "1px solid rgba(232,168,38,0.18)",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderRight: "1px solid rgba(232,168,38,0.18)",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "#6b665f",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Floor Price
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#e8a826",
            }}
          >
            {FLOOR_PRICE_DISPLAY} USDC
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px",
            borderRight: "1px solid rgba(232,168,38,0.18)",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "#6b665f",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Active Listings
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#2de07a",
            }}
          >
            {totalListings !== undefined ? totalListings.toString() : "—"}
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "#6b665f",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Ladder Total
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#e8a826",
            }}
          >
            {LADDER_TOTAL_DISPLAY} USDC
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#6b665f",
              marginTop: "4px",
            }}
          >
            {LADDER_STEPS} steps
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <div
        style={{
          border: "1px solid rgba(232,168,38,0.18)",
          padding: "24px",
          marginBottom: "0",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            letterSpacing: "0.35em",
            color: "#e8a826",
            textTransform: "uppercase",
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(212,207,200,0.08)",
          }}
        >
          Active PCE Events
        </div>

        {!listings || listings.length === 0 ? (
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "16px",
              color: "#6b665f",
              padding: "20px 0",
            }}
          >
            No active listings. Be the first to deposit.
          </div>
        ) : (
          listings.map((l) => {
            const price = (Number(l.listedPrice) / 1_000_000).toFixed(2);
            const dep = new Date(Number(l.depositTime) * 1000);
            const { isExpired, inGrace } = getListingStatus(l.depositTime);

            return (
              <div
                key={l.tokenId.toString()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(212,207,200,0.08)",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ color: "#f0ece4", marginBottom: "2px" }}>
                    Token #{l.tokenId.toString()}
                  </div>
                  <div style={{ fontSize: "10px", color: "#6b665f" }}>
                    {l.holder.slice(0, 8)}...{l.holder.slice(-4)} ·{" "}
                    {dep.toLocaleDateString()}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#e8a826",
                  }}
                >
                  {price} USDC
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: isExpired
                      ? "#e03a2d"
                      : inGrace
                        ? "#e8a826"
                        : "#2de07a",
                  }}
                >
                  {isExpired ? "EXPIRED" : inGrace ? "GRACE PERIOD" : "ACTIVE"}
                </div>
                <BuyButton tokenId={l.tokenId} isExpired={isExpired} />
              </div>
            );
          })
        )}
      </div>

      {/* Deposit Section */}
      <DepositButton />
    </div>
  );
}
