import type { Metadata } from "next";
import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My App",
  description: "Created with Next.js and MySQL",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <SidebarWrapper>
            {children}
          </SidebarWrapper>
        </Suspense>
      </body>
    </html>
  );
}