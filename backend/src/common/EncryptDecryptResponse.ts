import { aesDecrypt, aesEncrypt } from "../lib/utils/EncryptDecrypt";

export async function EncryptResponse(response: any) {
    return {
        encryptedResponse: aesEncrypt({
            data: JSON.stringify(response)
        })
    }
}

export async function DecryptResponse(response: any) {
    return aesDecrypt({ data: response })
}

