"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

function GlobalProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      {children}
    </QueryClientProvider>
  );
}

export default GlobalProviders;
