import Link from "next/link";
import LoginButton from "../auth-login";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const navigation = [
    { "name": "Home", "url": "/" },
    { "name": "Upload", "url": "/upload" }
  ];
  const { data: session } = useSession()

  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">
        {/* Logo  */}
        <>
          <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
            <Link href="/">
              <div className="text-black flex items-center justify-center">
                <p className="text-2xl font-bold tracking-wide">PicToContent</p>
              </div>
            </Link>
          </div>
        </>



        {/* menu  */}
        <div className="hidden text-center lg:flex lg:items-center">
          <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
            <li className="mr-3 nav__item">
              <Link href="/" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                Home
              </Link>
            </li>
            {
              session &&
              <li className="mr-3 nav__item">
                <Link href="/upload" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                  Upload
                </Link>
              </li>
            }

          </ul>
        </div>

        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
          <LoginButton />
        </div>

      </nav>
    </div>
  );
}

export default Navbar;
