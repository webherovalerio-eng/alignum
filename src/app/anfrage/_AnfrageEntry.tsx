"use client";

import { useSearchParams } from "next/navigation";
import { AnfrageForm } from "@/components/form/AnfrageForm";

export function AnfrageEntry() {
  const sp = useSearchParams();
  const initialService = sp.get("service") ?? undefined;
  return <AnfrageForm initialService={initialService} />;
}
