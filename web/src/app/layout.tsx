// Root layout — minimal passthrough.
// Each sub-route ([locale], dashboard) provides its own <html><body>
// with locale-specific lang and dir attributes.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
