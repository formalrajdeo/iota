import { BACKEND_URL } from '@/config/config';
import { aesDecrypt, aesEncrypt } from './EncryptDecrypt';

export default async function fetchApi({ url, httpMethod, encryptedBody }: any) {
    const res = await fetch(`${BACKEND_URL}${url}`, {
        method: httpMethod,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedBody: aesEncrypt({ data: JSON.stringify(encryptedBody) }) })
    });

    const decryptedResponse = await res.json();

    if (!decryptedResponse.encryptedResponse) {
        throw new Error('Invalid response');
    }

    const decryptedData = aesDecrypt({ data: decryptedResponse.encryptedResponse });
    // Handle errors
    if (!decryptedData) {
        throw new Error('Failed to fetch data');
    }

    return decryptedData;
}