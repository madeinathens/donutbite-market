import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { parseUnits } from "viem";
import { MARKET_CONTRACT, DONUTBNK_NFT } from "../config";

const MARKET_ABI = [
  {
    name: "depositNFT",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "setListingPrice",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "priceUSDC", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

const ERC721_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "getApproved",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
] as const;

type Step = "idle" | "approving" | "depositing" | "pricing" | "done" | "error";

export default function DepositButton() {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("3.30");
  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { writeContractAsync } = useWriteContract();

  async function handleDeposit() {
    if (!address || !tokenId) return;
    setErrorMsg("");

    try {
      const tid = BigInt(tokenId);
      const priceWei = parseUnits(price, 6);

      // ─── Step 1: Approve NFT ───────────────────────
      setStep("approving");
      await writeContractAsync({
        address: DONUTBNK_NFT as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "approve",
        args: [MARKET_CONTRACT as `0x${string}`, tid],
      });

      // ─── Step 2: Deposit NFT ───────────────────────
      setStep("depositing");
      await writeContractAsync({
        address: MARKET_CONTRACT as `0x${string}`,
        abi: MARKET_ABI,
        functionName: "depositNFT",
        args: [tid],
      });

      // ─── Step 3: Set listing price ─────────────────
      setStep("pricing");
      await writeContractAsync({
        address: MARKET_CONTRACT as `0x${string}`,
        abi: MARKET_ABI,
        functionName: "setListingPrice",
        args: [tid, priceWei],
      });

      setStep("done");
    } catch (e: unknown) {
      setStep("error");
      const msg = e instanceof Error ? e.message : "Transaction failed";
      setErrorMsg(msg.slice(0, 80));
    }
  }

  const labels: Record<Step, string> = {
    idle: "DEPOSIT & LIST →",
    approving: "APPROVING NFT...",
    depositing: "DEPOSITING...",
    pricing: "SETTING PRICE...",
    done: "✓ LISTED — x⁰ = 1",
    error: "TRY AGAIN",
  };

  const inputStyle = {
    background: "#0a0d10",
    border: "1px solid rgba(232,168,38,0.18)",
    color: "#f0ece4",
    padding: "10px 14px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "12px",
    outline: "none",
    width: "100%",
  };

  return (
    <div
      style={{
        border: "1px solid rgba(232,168,38,0.18)",
        padding: "24px",
        marginTop: "24px",
      }}
    >
      {/* Title */}
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
        Deposit NFT — Enter the Loop
      </div>

      {/* Inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "#6b665f",
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            Token ID
          </div>
          <input
            type="number"
            placeholder="e.g. 13"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            style={inputStyle}
            disabled={step !== "idle" && step !== "error"}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "#6b665f",
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            Price (USDC)
          </div>
          <input
            type="number"
            placeholder="3.30"
            value={price}
            step="0.01"
            min="3.30"
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
            disabled={step !== "idle" && step !== "error"}
          />
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          fontSize: "10px",
          color: "#6b665f",
          letterSpacing: "0.1em",
          marginBottom: "16px",
          lineHeight: 1.6,
        }}
      >
        NFT locks for 48h grace period. After 7 days → force-buyable.
        <br />
        Min price: 3.30 USDC · x⁰ = 1
      </div>

      {/* Button */}
      <button
        onClick={handleDeposit}
        disabled={
          !address ||
          !tokenId ||
          step === "approving" ||
          step === "depositing" ||
          step === "pricing" ||
          step === "done"
        }
        style={{
          background:
            step === "done"
              ? "rgba(45,224,122,0.1)"
              : step === "error"
                ? "rgba(224,58,45,0.1)"
                : "transparent",
          border:
            step === "done"
              ? "1px solid rgba(45,224,122,0.4)"
              : step === "error"
                ? "1px solid rgba(224,58,45,0.4)"
                : "1px solid rgba(45,224,122,0.4)",
          color:
            step === "done"
              ? "#2de07a"
              : step === "error"
                ? "#e03a2d"
                : "#2de07a",
          padding: "12px 24px",
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.25em",
          fontWeight: "700",
          cursor: step === "done" ? "default" : "pointer",
          textTransform: "uppercase",
          transition: "all 0.2s",
          opacity: !address || !tokenId ? 0.5 : 1,
        }}
      >
        {labels[step]}
      </button>

      {/* Error */}
      {step === "error" && errorMsg && (
        <div
          style={{
            fontSize: "9px",
            color: "#e03a2d",
            marginTop: "8px",
            letterSpacing: "0.1em",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Not connected */}
      {!address && (
        <div
          style={{
            fontSize: "9px",
            color: "#6b665f",
            marginTop: "8px",
            letterSpacing: "0.1em",
          }}
        >
          Connect wallet to deposit
        </div>
      )}
    </div>
  );
}
