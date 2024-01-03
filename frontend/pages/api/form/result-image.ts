import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { ApiInput } from '@/components/type'
import { type } from 'os'
const URL = JSON.parse(process.env.secret as any).NEXT_PUBLIC_BACKEND_URL

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session: any = await getServerSession(req, res, authOptions)
    if (session) {
        if (req.method === 'POST') {
            try {
                const input: ApiInput = JSON.parse(req.body)
                const data = {
                    "uniqueId": session.id,
                    "filename": input.filename
                }
                
                const result = await getResultServer(data)
                
                res.status(200).json(result)
            } catch (err) {
                res.status(500).json({ error: 'failed to load data' })
            }
        } else {
            // Handle any other HTTP method
            res.status(500)
        }
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
}


async function getResultServer(data: any) {
    try {
        
        const response = await fetch(URL + '/api/get-result', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result
    } catch (error) {
        console.error('Error posting data:', error);
    }
}