import type { NextPage } from "next";

const TestIndex: NextPage = () => {
  return (
    <div className={`text-center p-4`}>
      test page
      <br />
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Frontend Error");
        }}
      >
        Throw error
      </button>
    </div>
  );
};

export default TestIndex;
