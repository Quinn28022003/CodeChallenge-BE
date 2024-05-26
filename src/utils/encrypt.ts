import * as CryptoJS from 'crypto-js'

export const encrypt = async (data: any, secret: string): Promise<string> => {
	const ciphertext: string = await CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString()
	return ciphertext
}
