import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <div className='mx-10'>
        <Footer />
      </div>
    </SessionProvider>
  );
}
