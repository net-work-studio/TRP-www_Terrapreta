import { connection } from "next/server";
import { Suspense } from "react";

async function BackendContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  return children;
}

export default function BackendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={null}>
      <BackendContent>{children}</BackendContent>
    </Suspense>
  );
}
