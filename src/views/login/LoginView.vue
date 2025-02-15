<template>
	<v-card id="login-card">
		<v-card-title>Welcome</v-card-title>

		<v-form id="login-form" v-model="form">
			<div id="login-form-text">
				<v-text-field
					id="login-form-text-username"
					label="Username"
					v-model="username"
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
					:disabled="!form"
					@click="submitLogin()"
				></v-btn>

				<div id="login-form-button-forgot">
					<v-dialog v-model="forgot">
						<template v-slot:activator="{ props: activatorProps }">
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
									v-model="email"
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
									:disabled="!email"
									@click="sendEmail()"
								></v-btn>
							</div>

							<div id="forgot-card-alert">
								<v-alert
									v-if="alertForgot"
									type="info"
									title="Email Sent"
									>If the email provided has an account, it
									will receive an email shortly with the steps
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

				<v-alert v-if="alertSame" type="warning" title="Retry" closable
					>Username cannot be the same as the password. Try
					again.</v-alert
				>
			</div>
		</v-form>
	</v-card>
</template>

<script src="./LoginView.ts" />

<style src="./LoginView.scss" />
