import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Static HTML export → deployable to any static host (Cloudflare Pages, etc.)
  output: "export",
  // We sit inside the carto-ansh repo, which has its own lockfile. Pin the
  // workspace root to this folder so Next doesn't infer the parent.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
