import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { MARKET_CONTRACT, USDC_ADDRESS } from "../config";

const MARKET_ABI = [
  {
    name: "effectivePrice",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "buyNFT",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "buyExpiredNFT",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
] as const;

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

interface BuyButtonProps {
  tokenId: bigint;
  isExpired: boolean;
}

type Step = "idle" | "approving" | "buying" | "done" | "error";

export default function BuyButton({ tokenId, isExpired }: BuyButtonProps) {
  const { address } = useAccount();
  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: price } = useReadContract({
    address: MARKET_CONTRACT as `0x${string}`,
    abi: MARKET_ABI,
    functionName: "effectivePrice",
    args: [tokenId],
  });

  const { data: allowance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address ?? "0x0", MARKET_CONTRACT as `0x${string}`],
    query: { enabled: !!address },
  });

  const { writeContractAsync } = useWriteContract();

  async function handleBuy() {
    if (!address || !price) return;
    setErrorMsg("");

    try {
      // ─── Step 1: Approve USDC if needed ───────────────
      if (!allowance || allowance < price) {
        setStep("approving");
        await writeContractAsync({
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [MARKET_CONTRACT as `0x${string}`, price],
        });
      }

      // ─── Step 2: Buy NFT ───────────────────────────────
      setStep("buying");
      await writeContractAsync({
        address: MARKET_CONTRACT as `0x${string}`,
        abi: MARKET_ABI,
        functionName: isExpired ? "buyExpiredNFT" : "buyNFT",
        args: [tokenId],
      });

      setStep("done");
    } catch (e: unknown) {
      setStep("error");
      const msg = e instanceof Error ? e.message : "Transaction failed";
      setErrorMsg(msg.slice(0, 80));
    }
  }

  // ─── Labels per step ──────────────────────────────────
  const labels: Record<Step, string> = {
    idle: isExpired ? "COLLECT EXPIRED" : "🜁 BUY NOW — x⁰ = 1",
    approving: "APPROVING USDC...",
    buying: "BUYING...",
    done: "✓ PCE PROPAGATED",
    error: "TRY AGAIN",
  };

  const priceDisplay = price ? (Number(price) / 1_000_000).toFixed(2) : "...";

  return (
    <div>
      {/* Price display */}
      {price && step === "idle" && (
        <div
          style={{
            fontSize: "11px",
            color: "#9e9890",
            marginBottom: "8px",
            letterSpacing: "0.1em",
          }}
        >
          {priceDisplay} USDC
        </div>
      )}

      {/* Buy button */}
      <button
        onClick={handleBuy}
        disabled={
          !address ||
          step === "approving" ||
          step === "buying" ||
          step === "done"
        }
        style={{
          background:
            step === "done"
              ? "rgba(45,224,122,0.15)"
              : step === "error"
                ? "rgba(224,58,45,0.15)"
                : "#e8a826",
          border:
            step === "done"
              ? "1px solid rgba(45,224,122,0.4)"
              : step === "error"
                ? "1px solid rgba(224,58,45,0.4)"
                : "none",
          color:
            step === "done"
              ? "#2de07a"
              : step === "error"
                ? "#e03a2d"
                : "#050608",
          padding: "10px 20px",
          fontFamily: "'Space Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.2em",
          fontWeight: "700",
          cursor: step === "done" ? "default" : "pointer",
          textTransform: "uppercase",
          transition: "all 0.2s",
          opacity:
            !address || step === "approving" || step === "buying" ? 0.6 : 1,
        }}
      >
        {labels[step]}
      </button>

      {/* Error message */}
      {step === "error" && errorMsg && (
        <div
          style={{
            fontSize: "9px",
            color: "#e03a2d",
            marginTop: "6px",
            letterSpacing: "0.1em",
            maxWidth: "200px",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Not connected hint */}
      {!address && (
        <div
          style={{
            fontSize: "9px",
            color: "#6b665f",
            marginTop: "6px",
            letterSpacing: "0.1em",
          }}
        >
          Connect wallet to buy
        </div>
      )}
    </div>
  );
}
