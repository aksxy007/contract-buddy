'use client'

import React from "react";
import { queryClient } from "./react-query-client";
import { QueryClientProvider } from "@tanstack/react-query";


export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider> 
  );
}
