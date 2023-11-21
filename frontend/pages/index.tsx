import AddDataForm from '@/components/form'
import type { NextPage } from 'next'

import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className='bg-white min-h-screen'>
        <AddDataForm/>
      </div>
      
    </>
  )
}

export default Home