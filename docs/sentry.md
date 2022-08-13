yarn add @sentry/nextjs

npx @sentry/wizard -i nextjs

https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/



# api routes
import type { NextApiRequest, NextApiResponse } from "next"
import { withSentry } from "@sentry/nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: "John Doe" });
};

export default withSentry(handler);



[一篇关于Sentry-CLI 的使用详解](https://www.51cto.com/article/681321.html)



# performance
https://docs.sentry.io/platforms/javascript/guides/nextjs/performance/