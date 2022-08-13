/**
 * NOTE: This requires `@sentry/nextjs` version 7.3.0 or higher.
 *
 * This page is loaded by Nextjs:
 *  - on the server, when data-fetching methods throw or reject
 *  - on the client, when `getInitialProps` throws or rejects
 *  - on the client, when a React lifecycle method throws or rejects, and it's
 *    caught by the built-in Nextjs error boundary
 *
 * See:
 *  - https://nextjs.org/docs/basic-features/data-fetching/overview
 *  - https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 *  - https://reactjs.org/docs/error-boundaries.html
 */

import * as Sentry from "@sentry/nextjs";
import type { NextPage, NextPageContext } from "next";
import type { ErrorProps } from "next/error";
import NextErrorComponent from "next/error";

// const CustomErrorComponent: NextPage<ErrorProps> = props => {
//   // If you're using a Nextjs version prior to 12.2.1, uncomment this to
//   // compensate for https://github.com/vercel/next.js/issues/8592
//   // Sentry.captureUnderscoreErrorException(props);

//   return <NextErrorComponent statusCode={ props.statusCode } />;
// };

// CustomErrorComponent.getInitialProps = async contextData => {
//   // In case this is running in a serverless function, await this in order to give Sentry
//   // time to send the error before the lambda exits
//   await Sentry.captureUnderscoreErrorException(contextData);

//   // This will contain the status code of the response
//   return NextErrorComponent.getInitialProps(contextData);
// };

// export default CustomErrorComponent;


export interface MyErrorPageContext extends NextPageContext {
  statusCode: number;
  hasGetInitialPropsRun: boolean;
}

type PromiseResult<T> = T extends Promise<infer U> ? U : T;
type InitialProps = PromiseResult<ReturnType<typeof getInitialProps>>;

const MyError: NextPage<MyErrorPageContext, InitialProps> = ({
  statusCode,
  hasGetInitialPropsRun,
  err,
}) => {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err);
    // Flushing is not required in this case as it only happens on the client
  }

  // return <NextErrorComponent statusCode={ statusCode } />;
  return null
};

const getInitialProps = async (props: NextPageContext) => {
  const { res, err, asPath } = props;
  const errorInitialProps: ErrorProps & {
    hasGetInitialPropsRun?: boolean;
  } = await NextErrorComponent.getInitialProps(props);

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true;

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (err) {
    Sentry.captureException(err);

    // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses
    await Sentry.flush(2000);

    return errorInitialProps;
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  );
  await Sentry.flush(2000);

  return errorInitialProps;
};
MyError.getInitialProps = getInitialProps;

export default MyError;
