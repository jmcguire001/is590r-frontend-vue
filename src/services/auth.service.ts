import axios from "axios"
import API_URL from "./env"

class AuthService {
	login(user) {
		let formData = new FormData()
		formData.append("email", user.email)
		formData.append("password", user.password)
		return axios.post(API_URL + "login", formData).then((response) => {
			console.log("response -- ", response)
			if (response.data.data.token) {
				localStorage.setItem("user", JSON.stringify(response.data.data))
			}

			return response.data
		})
	}

	logout() {
		localStorage.removeItem("user")
	}

	register(user) {
		return axios.post(API_URL + "register", {
			name: user.name,
			email: user.email,
			password: user.password,
			c_password: user.c_password
		})
	}

	forgotPassword(email) {
		console.log("inside service -- ", email)
		let formData = new FormData()
		formData.append("email", email)
		return axios
			.post(API_URL + "forgot_password", formData)
			.then((response) => {
				console.log("response -- ", response)
				return response.data
			})
	}
}

const authService = new AuthService()
export default authService
