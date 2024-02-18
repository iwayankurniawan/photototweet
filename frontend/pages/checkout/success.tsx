import Head from "next/head";
import Link from "next/link";

const Success = () => {
  return (
    <>
      <Head>
        <title>Success Page</title>
      </Head>
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-green-400 md:text-6xl">Payment Success</h1>
          <p className="text-base md:text-xl font-semibold tracking-tight text-gray-900 mt-4">Thank Your for Your Payment</p>
          <p className="text-base md:text-xl text-gray-900">Your Credits is Added</p>
          <button className="mt-4 items-center px-6 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-md md:ml-5 md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <Link href="/upload" >
              Go to Upload Menu
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default Success;