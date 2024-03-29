import AddDataForm from '@/components/form'
import SectionTitle from '@/components/home/sectionTitle'
import { useRouter } from 'next/router';
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/home/navbar'
import LoadingSpinner from '@/components/loading-spinner'
import ErrorMessage from '@/components/error-message'
import { useEffect } from 'react';
import CheckoutForm from '@/components/stripe/checkoutForm';

export default function Upload() {
  const { data: session, status } = useSession()
  const router = useRouter();

  useEffect(() => {
    /*
    if (!session) {
      router.replace('/');
    }
    */
  }, []);

  if (status === 'loading') {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <LoadingSpinner />
      </div>)
  } else {
    return (
      <>
        <Head>
          <title>PicToContent - Upload Image</title>
          <meta
            name="description"
            content="PicToContent - Picture to Content for your Social Media"
          />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        </Head>
        
        {
          session
            ?
            <div className='bg-gray-100'>
              <div className='mx-5 lg:mx-10 pb-8'>
                <SectionTitle title="Upload Your Photo">
                  Enhance your experience by uploading your photo here, allowing us to generate tailored and optimized text that seamlessly complements your image
                </SectionTitle>
                <CheckoutForm />
                <AddDataForm/>
              </div>
            </div>
            :
            <ErrorMessage />
        }
      </>
    )
  }
}

