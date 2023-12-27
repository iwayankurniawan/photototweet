import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next"
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import Head from 'next/head'
import { MouseEvent } from "react"
import { authOptions } from "../api/auth/[...nextauth]"
import Navbar from "@/components/home/navbar"

export default function SignIn({
    providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const handleSignIn = async (e: MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault();
        await signIn(id); // or 'twitter' for Twitter authentication
    };

    return (
        <>
            <Head>
                <title>PicToContent Signin</title>
                <meta
                    name="description"
                    content="PicToContent - Sign In"
                />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
            </Head>
            <div className='mx-10'>
                <Navbar />
            </div>
            <div className="grid h-screen w-screen place-items-center shadow px-4 text-sm font-medium">
                <div className="w-full max-w-sm rounded-lg shadow-2xl">
                    <div className="text-black py-3 flex items-center justify-center flex flex-col">
                        <p className="text-2xl font-bold tracking-wide">PicToContent</p>
                    </div>
                    <div className="grid place-items-center">
                        <p>Please Login Using Below Method</p>
                    </div>
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>

                            <form className="p-4 md:p-5 lg:p-6">
                                <div className="grid gap-y-3">
                                    <button
                                        className="flex items-center justify-center gap-x-2 rounded-md border border-slate-600 bg-slate-700 py-3 px-4 text-slate-300 transition hover:text-gray-400"
                                        onClick={(e: any) => handleSignIn(e, provider.id)}>
                                        {provider.name === "Google" ? <Google /> : provider.name === "Twitter" ? <Twitter /> : ""}
                                        Sign in with {provider.name}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return { redirect: { destination: "/" } }
    }

    const providers = await getProviders()

    return {
        props: { providers: providers ?? [] },
    }
}

function Google() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-google"
            viewBox="0 0 16 16"
        >
            <path
                d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                fill="#cbd5e1"
            ></path>
        </svg>
    )
}

function Twitter() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M24 4.37a9.6 9.6 0 0 1-2.83.8 5.04 5.04 0 0 0 2.17-2.8c-.95.58-2 1-3.13 1.22A4.86 4.86 0 0 0 16.61 2a4.99 4.99 0 0 0-4.79 6.2A13.87 13.87 0 0 1 1.67 2.92 5.12 5.12 0 0 0 3.2 9.67a4.82 4.82 0 0 1-2.23-.64v.07c0 2.44 1.7 4.48 3.95 4.95a4.84 4.84 0 0 1-2.22.08c.63 2.01 2.45 3.47 4.6 3.51A9.72 9.72 0 0 1 0 19.74 13.68 13.68 0 0 0 7.55 22c9.06 0 14-7.7 14-14.37v-.65c.96-.71 1.79-1.6 2.45-2.61z" />
        </svg>
    )
}
