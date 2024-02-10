import Navbar from '@/components/home/navbar'
import SectionTitle from '@/components/home/sectionTitle'
import Head from 'next/head'

export default function Privacy() {
    return (
        <>
            <Head>
                <title>PicToContent - Privacy</title>
                <meta
                    name="description"
                    content="PicToContent - Picture to Content for your Social Media"
                />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
            </Head>
            
            <div className='bg-gray-100'>
                <div className='mx-10 pb-8'>
                    <SectionTitle title="PicToContent Privacy" />
                    <div className="flex justify-center items-center">
                        <div className="text-left w-9/12 xl:w-1/2">
                            <p className="mb-4 text-left">
                                We believe that your privacy is important and it is our policy to respect your privacy regarding any information we may collect from on <a href={process.env.NEXTAUTH_URL} className="text-blue-500 underline">https://pictocontent.techraveller.com</a>.
                            </p>
                            <p className="mb-4 text-left">
                                We only ask for personal information when we truly need it to provide a service to you, improve our service, and get feedback from you. We collect it by fair and lawful means, with your knowledge and consent.
                            </p>
                            <p className="mb-4 text-left">
                                We only retain collected information for as long as necessary to provide you with your requested service, and we will take professional measures to ensure your data is secure.
                            </p>
                            <p className="mb-4 text-left">
                                We don't share any personally identifying information publicly or with third-parties, except when required to by law.
                            </p>
                            <p className="mb-4 text-left">
                                By continuing to use our website, you accept our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us at <a href="https://twitter.com/getontrip" className="text-blue-500 underline">@getontrip</a>.
                            </p>
                            <p className="text-left">
                                This privacy policy is effective starting on 04 February 2024.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

