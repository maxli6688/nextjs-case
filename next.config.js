/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");

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

// module.exports = nextConfig;

const sentryConfig = {
  // Optional build-time configuration options
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  sentry: {
    // See the 'Configure Source Maps' and 'Configure Legacy Browser Support'
    // sections below for information on the following options:
    // disableServerWebpackPlugin: true,
    // disableClientWebpackPlugin: true,
    // hideSourceMaps: true,
    // widenClientFileUpload: true,
    // transpileClientSDK: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
