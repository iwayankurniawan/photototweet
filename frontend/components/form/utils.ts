import { getPresignedUrl } from "./formapi";

async function combinePresignedAndUploadToS3(file: File){
    const presignedData = await getPresignedUrl(file)
    const result = await uploadImageToS3(file, presignedData)
    return result
}

async function uploadImageToS3(file: File, presignedUlrData: any) {
    try {
        let form = new FormData()
        Object.keys(presignedUlrData.presigned.fields).forEach(key => form.append(key,presignedUlrData.presigned.fields[key]))
        form.append('file', file as File)
        let res = await fetch(presignedUlrData.presigned.url, {
            method: "POST",
            body: form
        })
        return presignedUlrData.filename
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};


// Example usage with multiple API calls
export async function sendMultipleRequests(imageList: File[]) {
    // Create an array of promises for each API call
    const promises = Array.from(imageList).map((file: File) => combinePresignedAndUploadToS3(file));

    try {
        // Wait for all promises to resolve
        const results = await Promise.all(promises);

        // All API calls have completed successfully
        console.log('All requests successful:', results);
        return results
    } catch (error) {
        // Handle errors from any of the API calls
        console.error('Error in one or more requests:', error);
    }
}