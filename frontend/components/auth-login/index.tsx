import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function LoginButton() {
    const { data: session } = useSession()
    const [showDropdown, setShowDropDown] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null);

    // click listeners for closing dropdown
    useEffect(() => {    
        // close dropdown if click outside
        function close(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                
                setShowDropDown(false)
            }
        }
        // add or remove event listener
        if (showDropdown) {
            window.addEventListener("click", close);
        }
        // cleanup
        return function removeListener() {
            window.removeEventListener("click", close);
        };
    }, [showDropdown]); // only run if open state changes

    if (session) {
        return (
            <>
                <div className="relative" >
                    {/* Button for Small Screen */}
                    <div className="block flex lg:hidden" ref={dropdownRef}>
                        <button onClick={() => setShowDropDown(!showDropdown)} className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    {/* Button for Large Screen */}
                    <div className="hidden lg:flex" ref={dropdownRef}>
                        <button  onClick={() => setShowDropDown(!showDropdown)} id="dropdownSmallButton" data-dropdown-toggle="dropdownSmall" className="inline-flex items-center px-6 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-md md:ml-5 md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                            Options
                            <svg className="w-2 h-2 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                    </div>

                    <div id="dropdownSmall" className={`absolute right-0 mt-2 bg-gray-50 rounded-lg shadow-lg   ${showDropdown ? "" : "hidden"}`}>
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div>Signed in as</div>
                            <div className="font-medium truncate">{session.user?.email}</div>
                        </div>
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div>Images Credits:</div>
                            <div className="font-medium truncate">{(session as any).credits}</div>
                        </div>
                        <div className="flex lg:hidden flex-col lg:flex-row">
                            <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                Home
                            </Link>
                            <Link href="/upload" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                Upload
                            </Link>
                            <Link href="/result" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                Result
                            </Link>
                        </div>

                        <div className="py-1">
                            <a href="#" onClick={() => signOut()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <button className="px-5 py-2 text-white bg-indigo-600 rounded-md md:ml-5" onClick={() => signIn()}>Get Started</button>
            </>
        )
    }
}

export default LoginButton