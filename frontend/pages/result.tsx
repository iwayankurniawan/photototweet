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
    const [loadData, setLoadData] = useState<boolean>(false)
    const router = useRouter();

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        console.log(status)
    }, [status]);

    async function fetchData() {
        setLoadData(true)
        const val = await getResult();
        if (result) {
            setResult((prevData: any) => [...prevData, ...val]);
        } else {
            setResult(val);
        }
        setLoadData(false)
    }

    async function loadMore() {
        const val = await getResult(result[result.length - 1].filename);
        setResult((prevData: any) => [...prevData, ...val]);
    }


    if (status === "unauthenticated") {
        router.replace('/');
        return (
            <ErrorMessage />
        )
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

                {
                    <div className='bg-gray-100'>
                        <div className='mx-0 md:mx-4 lg:mx-8'>
                            <div className='flex flex-col'>
                                <SectionTitle title="Result">
                                    Explore the outcome of your image through our advanced content generation process displayed below.
                                </SectionTitle>
                                {
                                    loadData ?
                                        <div className='mb-4'>
                                            <LoadingSpinner />
                                        </div>

                                        :

                                        (result && result.length !== 0 && !loadData) ?
                                            <>
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
                                            :
                                            <p>No Result</p>
                                }
                            </div>
                        </div>
                    </div>
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
