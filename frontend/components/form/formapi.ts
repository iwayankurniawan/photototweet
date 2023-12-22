import { ApiInput, UserForm } from "../type";
const URL = process.env.NEXT_PUBLIC_BACKEND_URL


export async function getPresignedUrl(file: File) {
    try {
        const data:ApiInput = {
            "uniqueId":"test",
            "filename": file.name
        }
        const response = await fetch(URL + '/api/create-upload-token', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return JSON.parse(result.body)
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

export async function uploadData(filename: string){
    try {
        const data:ApiInput = {
            "filename": filename
        }

        const response = await fetch(URL + '/api/upload-image', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const final_result = JSON.parse(result.body)
        return {"text": final_result.result, "filename":filename}
    } catch (error) {
        console.error('Error posting data:', error);
    }
}