/** @type {import('next').NextConfig} */

const path = require("path");
const nextBuildId = require("next-build-id");
const envResult = require("dotenv").config({
  path: `./config/.env.${process.env.ENV || "production"}`,
});

const isProd = process.env.ENV === "production";
// - The value at .assetPrefix must be 1 character or more but it was 0 characters.
const assetPrefix = isProd ? { assetPrefix: "//nft-resource.karmaverse.io/wallet/" } : {};

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...assetPrefix,
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
        locale: false,
      },
    ];
  },
};

module.exports = nextConfig;
