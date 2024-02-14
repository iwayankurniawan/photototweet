import Navbar from '@/components/home/navbar'
import SectionTitle from '@/components/home/sectionTitle'
import Head from 'next/head'

export default function Terms() {
    return (
        <>
            <Head>
                <title>PicToContent - Terms</title>
                <meta
                    name="description"
                    content="PicToContent - Picture to Content for your Social Media"
                />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
            </Head>
            
            <div className='bg-gray-100'>
                <div className='pb-8'>
                    <SectionTitle title="PicToContent Terms of Service"/>
                    <div className="flex justify-center items-center">
                        <div className="text-left w-9/12 xl:w-1/2">
                            <p className="mb-4 text-left">
                                By using <a href={process.env.NEXTAUTH_URL} className="text-blue-500 underline">https://pictocontent.techraveller.com</a>, you agree to comply with and be bound by these Terms of Use of <a href={process.env.NEXTAUTH_URL} className="text-blue-500 underline">https://pictocontent.techraveller.com</a> and/or any revised version. Any new service available on the <a href={process.env.NEXTAUTH_URL} className="text-blue-500 underline">https://pictocontent.techraveller.com</a> or any modification of an existing service will be governed by the Term of Service, which may be modified or updated from time to time. You are responsible to review Term of Service regularly.
                            </p>
                            <p className="mb-4 text-left">
                                Our service helps its user to generate social media caption or tweet by uploading an image. By using this service you are declaring that you are rightful to uploading the image. We only help you to generate the text based on the image uploaded. Make sure to respect the rights of other by not make available any content that you do not have the legal right to transmit.
                            </p>
                            <p className="mb-4 text-left">
                                Any violation to term of service will lead to the termination of your account and/or your access to the service also to disclose any information necessary to satisfy any law, regulation, governmental request or partner request.
                            </p>
                            <p className='font-bold text-xl'>Image Credits</p>
                            <p className="mb-4 text-left">
                                You can generate text as long as you still have credits on your account. Credits need to be bought in this application.
                            </p>
                            <p className='font-bold text-xl'>Refund Policy</p>
                            <p className="mb-4 text-left">
                                Any credits can not be refunded unless we shutting down our service. User will get refund only for unused credits that is not older than 30 days since payment.You can ask refund by sending email request to contactme@techraveller.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

