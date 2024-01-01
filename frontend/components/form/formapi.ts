import { ApiInput } from "../type";

export async function getPresignedUrl(file: File) {
    try {
        const data:ApiInput = {
            "filename": file.name
        }
        const response = await fetch('api/form/retrieve-image-token', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const result = await response.json();
        
        return result
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

export async function uploadData(filename: string){
    try {
        const data:ApiInput = {
            "filename": filename
        }
        
        const response = await fetch('api/form/post-image', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        const final_result = result
        return {"text": final_result.result as string, "filename":filename}
    } catch (error) {
        console.error('Error posting data:', error);
    }
}