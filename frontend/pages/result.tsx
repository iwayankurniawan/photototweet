import FormResult from '@/components/form-result'
import type { NextPage } from 'next'

import Head from 'next/head'

const Result: NextPage = () => {
  return (
    <>
      <Head>
        <title>Result</title>
      </Head>
      <div className='bg-white min-h-screen'>
        <FormResult/>
      </div>
      
    </>
  )
}

export default Result