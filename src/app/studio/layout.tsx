import type { Metadata } from "next";
import { requireStudioUser } from "@/studio/dal";
import { StudioTopBar } from "./StudioTopBar";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStudioUser();
  return (
    <div className="min-h-dvh bg-background">
      <StudioTopBar email={user.email} />
      <div className="container-tight py-10">{children}</div>
    </div>
  );
}
