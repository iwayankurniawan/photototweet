import { UserForm } from "../type";
const URL = "http://localhost:5000"

export async function submitData(data: UserForm) {
    try {
        const response = await fetch(URL + '/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error posting data:', error);
    }
}