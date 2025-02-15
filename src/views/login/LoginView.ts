export default {
	name: "LoginView",
	emits: ["authenticate"],
	data: function () {
		return {
			isAuthenticated: false,
			form: false,
			username: "",
			password: "",
			alertSuccess: false,
			alertFail: false,
			alertSame: false,
			forgot: false,
			alertForgot: false
		}
	},
	methods: {
		submitLogin() {
			if (this.username === "gumpf" && this.password === "1forest1") {
				this.alertSuccess = true

				setTimeout(() => {
					this.alertSuccess = false
					this.isAuthenticated = true
					this.$emit("authenticate", this.isAuthenticated)
				}, 2500)
			}

			if (this.username === this.password) {
				this.alertSame = true

				setTimeout(() => {
					this.isAuthenticated = false
					this.alertSame = false
				}, 5000)
			} else if (
				this.username !== "gumpf" ||
				this.password !== "1forest1"
			) {
				this.alertFail = true

				setTimeout(() => {
					this.isAuthenticated = false
					this.alertFail = false
				}, 5000)
			}
		},
		sendEmail() {
			this.alertForgot = true
			this.forgot = true

			setTimeout(() => {
				this.alertForgot = false
				this.forgot = false
			}, 5000)
		},
		required(v) {
			return !!v || "Field is required"
		},
		minLength(length) {
			return (v) =>
				(v && v.length >= length) || `Min ${length} characters`
		}
	}
}
