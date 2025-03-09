export default {
	name: "LoginView",
	emits: ["authenticate"],
	data: function () {
		return {
			isAuthenticated: false,
			loginForm: false,
			isLoading: false,
			// errorMsg: "",
			email: "",
			password: "",
			alertSuccess: false,
			alertFail: false,
			alertSame: false,
			forgot: false,
			alertForgot: false,
			registerForm: false,
			registerValid: false,
			registerFormLoad: false,
			registerDialog: false,
			register: {
				name: "",
				email: "",
				password: "",
				confirmPassword: ""
			},
			submitForgotLoad: false,
			forgotEmail: ""
		}
	},
	methods: {
		submitLogin() {
			if (!this.loginForm) {
				return
			}

			const user = {
				email: this.email,
				password: this.password
			}

			console.log(user)

			this.errorMsg = ""
			this.isLoading = true

			// Reset alert flags before attempting login
			this.alertSuccess = false
			this.alertFail = false
			this.alertSame = false

			this.$store.dispatch("auth/login", user).then(
				() => {
					// Show success message
					this.alertSuccess = true
					setTimeout(() => {
						window.location.reload()
					}, 2000)
				},
				(error) => {
					this.isLoading = false
					// Show error message

					if (this.email === this.password) {
						this.alertSame = true
					} else {
						this.alertFail = true
					}

					this.errorMsg =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString()
				}
			)
		},
		submitRegister() {
			if (!this.registerValid) {
				return
			}

			const register = {
				name: this.register.name,
				email: this.register.email,
				password: this.register.password,
				c_password: this.register.confirmPassword
			}

			this.registerFormLoad = true
			this.$store.dispatch("auth/register", register).then(
				() => {
					alert("User successfully created.")
					this.registerFormLoad = false
					this.registerDialog = false
				},
				(error) => {
					this.registerFormLoad = false
					alert("Something went wrong. Please try again.")
				}
			)
		},
		submitForgotPassword() {
			this.submitForgotLoad = true

			this.$store.dispatch("auth/forgotPassword", this.forgotEmail).then(
				() => {
					this.alertForgot = true

					setTimeout(() => {
						this.alertForgot = false
						this.forgot = false
					}, 3000)
				},
				(error) => {
					this.submitForgotLoad = false
				}
			)
		},
		required(v) {
			return !!v || "Field is required"
		},
		minLength(length) {
			return (v) =>
				(v && v.length >= length) || `Min ${length} characters`
		},
		matchPassword() {
			return (v) =>
				(v && v === this.register.password) || "Password must match"
		}
	}
}
