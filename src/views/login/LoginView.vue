<template>
	<div id="login-view">
		<v-card id="login-card">
			<v-card-title>Login</v-card-title>

			<v-form id="login-form" v-model="loginForm">
				<div id="login-form-text">
					<v-text-field
						id="login-form-text-username"
						label="Email"
						v-model="email"
						hint="Min 3 characters"
						:rules="[required, minLength(3)]"
						clearable
					></v-text-field>
					<v-text-field
						id="login-form-text-password"
						label="Password"
						v-model="password"
						type="password"
						hint="Min 8 characters"
						:rules="[required, minLength(8)]"
						clearable
					></v-text-field>
				</div>

				<v-divider></v-divider>

				<div id="login-form-button">
					<v-btn
						text="Login"
						:disabled="!loginForm"
						@click="submitLogin()"
					></v-btn>

					<div id="login-form-button-forgot">
						<v-dialog v-model="forgot">
							<template
								v-slot:activator="{ props: activatorProps }"
							>
								<v-btn
									text="Forgot Password"
									v-bind="activatorProps"
								></v-btn>
							</template>

							<v-card id="forgot-card" title="Password Recovery">
								<div id="forgot-card-text">
									<v-text-field
										id="forgot-card-text-username"
										label="Email"
										v-model="forgotEmail"
										:rules="[required]"
										hint="Enter your email"
										clearable
									></v-text-field>
								</div>

								<div id="forgot-card-button">
									<v-btn
										text="Cancel"
										@click="forgot = false"
									></v-btn>

									<v-btn
										text="Send Email"
										:disabled="!forgotEmail"
										@click="submitForgotPassword()"
									></v-btn>
								</div>

								<div id="forgot-card-alert">
									<v-alert
										v-if="alertForgot"
										type="info"
										v-model="forgotEmail"
										title="Email Sent"
										>If you have an account, you will
										receive an email shortly with the steps
										to recover your password.</v-alert
									>
								</div>
							</v-card>
						</v-dialog>
					</div>
				</div>

				<div id="login-form-alert">
					<v-alert v-if="alertSuccess" type="success" title="Success!"
						>Login successful; redirecting...</v-alert
					>

					<v-alert
						v-if="alertFail"
						type="error"
						title="Invalid Login"
						closable
						>Login failed, try again.</v-alert
					>

					<v-alert
						v-if="alertSame"
						type="warning"
						title="Retry"
						closable
						>Username cannot be the same as the password. Try
						again.</v-alert
					>
				</div>
			</v-form>

			<v-form id="register-form" v-model="registerValid">
				<v-dialog v-model="registerForm">
					<template v-slot:activator="{ props: activatorProps }">
						<v-btn
							id="register-form-button"
							text="Register"
							v-bind="activatorProps"
						></v-btn>
					</template>

					<v-card id="register-card">
						<v-card-title>Register</v-card-title>

						<div id="register-card-text">
							<v-text-field
								label="Full Name*"
								v-model="register.name"
								:rules="[required]"
								hint="Enter your full name, first then last"
								clearable
							></v-text-field>
							<v-text-field
								label="Email*"
								v-model="register.email"
								:rules="[required]"
								hint="Enter a valid email address"
								clearable
							></v-text-field>
							<v-text-field
								label="Password*"
								v-model="register.password"
								type="password"
								hint="Must be at least 8 characters long"
								:rules="[required, minLength(8)]"
								clearable
							></v-text-field>
							<v-text-field
								label="Confirm Password*"
								v-model="register.confirmPassword"
								type="password"
								:rules="[
									required,
									matchPassword(register.confirmPassword)
								]"
								hint="Must match the password above"
								clearable
							></v-text-field>
						</div>

						<div id="register-card-buttons">
							<v-btn
								text="Cancel"
								@click="registerForm = false"
							></v-btn>
							<v-btn
								text="Submit"
								:disabled="!registerValid"
								@click="submitRegister()"
							></v-btn>
						</div>
					</v-card>
				</v-dialog>
			</v-form>
		</v-card>
	</div>
</template>

<script src="./LoginView.ts" />

<style src="./LoginView.scss" />
