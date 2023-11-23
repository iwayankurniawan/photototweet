export async function encodeImageAsText(file: File): Promise<string | null> {
    return new Promise((resolve) => {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    // Extract the base64 part from the Data URL
                    const base64String = reader.result.split(',')[1];
                    resolve(base64String);
                } else {
                    resolve(null);
                }
            };
        } catch (error) {
            console.error('Error encoding image:', error);
            resolve(null);
        }
    });
}

