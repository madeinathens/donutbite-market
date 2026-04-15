import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

// ─── Wagmi Config ───────────────────────────────
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

// ─── React Query ────────────────────────────────
const queryClient = new QueryClient();

// ─── Root ───────────────────────────────────────
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
