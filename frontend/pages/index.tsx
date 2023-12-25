import AddDataForm from '@/components/form'
import type { NextPage } from 'next'
import Hero from "../components/home/hero";
import Navbar from "../components/home/navbar";
import SectionTitle from "../components/home/sectionTitle";
import Footer from "../components/home/footer";


import Head from 'next/head'

const Home: NextPage = () => {
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
      <div className='mx-10'>
        <Navbar />
      </div>

      <div className='mx-10'>
        <Hero />
      </div>

      <div className='bg-gray-100'>
        <div className='mx-10 pb-8'>
          <SectionTitle pretitle="Step 1" title="Upload Your Photo">
            Enhance your experience by uploading your photo here, allowing us to generate tailored and optimized text that seamlessly complements your image
          </SectionTitle>
          <AddDataForm />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home