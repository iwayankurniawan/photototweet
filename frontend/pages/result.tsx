import AddDataForm from '@/components/form'
import SectionTitle from '@/components/home/sectionTitle'
import { useRouter } from 'next/router';
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/home/navbar'
import LoadingSpinner from '@/components/loading-spinner'
import ErrorMessage from '@/components/error-message'
import { useEffect, useState, useCallback, useMemo } from 'react';
import FormResult from '@/components/form-result';
import CopyToClipboardButton from '@/components/form-copy-to-clipboard';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { v4 as uuidv4 } from 'uuid';
import { ResultViewType } from '@/components/type';
import { format } from 'date-fns';
import { ApiInput } from '@/components/type';
import { te } from 'date-fns/locale.mjs';

export default function Result() {
    const { data: session, status } = useSession()
    const [result, setResult] = useState<any>()
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.replace('/');
        }

        fetchData()
    }, []);

    async function fetchData(){
        const val = await getResult();
        if (result) {
            setResult((prevData: any) => [...prevData, ...val]);
        } else {
            setResult(val);
        }
    }

    async function loadMore() {
        const val = await getResult(result[result.length - 1].filename);
        setResult((prevData: any) => [...prevData, ...val]);
    }


    if (status === 'loading') {
        return (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <LoadingSpinner />
            </div>)
    } else {
        return (
            <>
                <Head>
                    <title>PicToContent - Your Result</title>
                    <meta
                        name="description"
                        content="PicToContent - Picture to Content for your Social Media"
                    />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
                </Head>
                <div className='mx-10'>
                    <Navbar />
                </div>
                {
                    session
                        ?
                        <div className='bg-gray-100'>
                            <div className='mx-10'>
                                <div className='flex flex-col'>
                                    {
                                        result &&
                                        result.length !== 0 &&
                                        <>
                                            <SectionTitle title="Result">
                                                Explore the outcome of your image through our advanced content generation process displayed below.
                                            </SectionTitle>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                                                {
                                                    result.map((item: any) =>
                                                        <FormResult imgSrc={item.url} fileName={updateFileName(item.filename)} text={item.result} date={format(item.datetime, "MMMM d, yyyy h:mm:ss a")} key={uuidv4()} >
                                                            <div key={uuidv4()} className='flex justify-end mt-2'>
                                                                <CopyToClipboardButton textToCopy={item.text as string} key={uuidv4()} />
                                                            </div>
                                                        </FormResult>
                                                    )
                                                }
                                            </div>
                                            {result[result.length - 1].LastEvaluatedKey &&
                                                <div className='flex m-4  items-center justify-center text-center'>
                                                    <button
                                                        className="inline-block rounded border border-current px-8 py-3 text-sm font-medium text-indigo-600 transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-indigo-500"
                                                        onClick={() => loadMore()}>
                                                        loadMore
                                                    </button>
                                                </div>
                                            }

                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <ErrorMessage />
                }

            </>
        )
    }
}


async function getResult(filename?: string) {
    try {
        const data: ApiInput = {
            "filename": filename || ""
        }

        const response = await fetch('/api/form/result-image', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result)
        return result.result
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

function updateFileName(filename: string) {
    const parts = filename.split('_');
    const result = parts.slice(1).join('_');
    return result
}
