import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStudioUser } from "@/studio/dal";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Studio-Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  if (await getStudioUser()) redirect("/studio");
  const { e } = await searchParams;
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-24">
      <LoginForm initialError={e} />
    </div>
  );
}
