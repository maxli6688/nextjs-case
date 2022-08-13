1. 只配置 middleware拦截ua 拦截路由✔️

2. 添加CDN✔️  middleware ✔️
aws s3 sync ./.next/static s3://nft-resource-new/wallet/_next/static

3. sentry ✔️
https://github.com/getsentry/sentry-javascript
- 安装1 curl -sL https://sentry.io/get-cli/ | bash
sentry-cli --help

- 安装2 yarn add @sentry/cli
./node_modules/.bin/sentry-cli --help

sentry-cli --url https://sentry.karmaverse.io/ login

https://sentry.karmaverse.io/settings/account/api/auth-tokens/

1. public image

😈😈😈😈😈❌