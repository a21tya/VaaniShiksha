"use client";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
// Offline documents are cached independently of Next's RSC navigation payloads.
export default function OfflineLink(props: ComponentPropsWithoutRef<"a"> & { href: string }) {
  const online = useNetworkStatus();
  return online ? <Link {...props} prefetch={false}/> : <a {...props}/>;
}
