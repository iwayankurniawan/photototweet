import Head from "next/head";
import Link from "next/link";

const Error = () => {
  return (
    <>
      <Head>
        <title>Error Page</title>
      </Head>
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-red-400 md:text-6xl">Payment Failed</h1>
          <p className="text-base md:text-xl font-semibold tracking-tight text-gray-900 mt-4">Error with Your Payment</p>
          <p className="text-base md:text-xl text-gray-900">Your Credits is Not Added</p>
          <button className="mt-4 items-center px-6 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-md md:ml-5 md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <Link href="/" >
              Back to Home
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default Error;