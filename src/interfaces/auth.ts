import { IUsers, IUsersConvert } from 'src/interfaces/Users'

export interface IPayloadGenerateToke {
	id: string
	email: string
	role: string
	isLoggedIn: boolean
}

export interface ISignIn {
	data: IUsers
	token: {
		access_token: string
		refresh_token: string
	}
	isLoggedIn: boolean
}

export interface IGenerateToke {
	access_token: string
	refresh_token: string
}

export interface IVerifyToken {
	user: IUsersConvert
	access_token?: string
	isLoggedIn: boolean
}

export interface IRefreshToken {
	access_token: string
}
