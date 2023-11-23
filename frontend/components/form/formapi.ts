import { UserForm } from "../type";
const URL = "http://localhost:5000"

export async function submitData(formData: FormData) {
    try {
        const response = await fetch(URL + '/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        return result
    } catch (error) {
        console.error('Error posting data:', error);
    }
}