import type { NextPage } from 'next'
import Hero from "@/components/home/hero";
import Footer from "@/components/home/footer";
import Head from 'next/head'
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/loading-spinner';
import Navbar from '@/components/home/navbar';
import FaqSection from '@/components/faq-section';

const Home: NextPage = () => {
  const { status } = useSession()
  
  if (status === 'loading') {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <LoadingSpinner />
      </div>)
  } else {
    return (
      <>
        <Head>
          <title>PicToContent - Picture to Content for your Social Media</title>
          <meta
            name="description"
            content="PicToContent - Picture to Content for your Social Media"
          />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        </Head>
        <Hero />
        <FaqSection/>
      </>
    )
  }
}

export default Home