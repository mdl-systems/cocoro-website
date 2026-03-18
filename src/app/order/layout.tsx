import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "購入申込 — COCORO OS",
  description:
    "COCORO OS の購入申込フォームです。Starter（¥49,800）・Pro（¥89,800）プランからお選びいただけます。ご注文後、担当者より3営業日以内にご連絡いたします。",
  robots: { index: false, follow: false }, // checkoutページはnoindex
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
