import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";

export function LoginButton() {
    const { data: session } = useSession()
    const [showDropdown, setShowDropDown] = useState<boolean>(false)
    
    if (session) {
        return (
            <>
                <div className="relative "> 
                    <button onClick={() => setShowDropDown(!showDropdown)} id="dropdownSmallButton" data-dropdown-toggle="dropdownSmall" className="inline-flex items-center px-6 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-md md:ml-5 md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                        Options
                        <svg className="w-2 h-2 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>

                    <div id="dropdownSmall" className={`absolute right-0 mt-2 bg-gray-50 rounded-lg shadow-lg   ${showDropdown ? "":"hidden"}`}>
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div>Signed in as</div>
                            <div className="font-medium truncate">{session.user?.email}</div>
                        </div>
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div>Images Quota:</div>
                            <div className="font-medium truncate">{(session as any).credits}</div>
                        </div>
                        <div className="py-2">
                            <a href="#" onClick={() => signOut()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <button className="px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5" onClick={() => signIn()}>Get Started</button>
            </>
        )
    }
}

export default LoginButton