<template>
	<v-btn color="#666666" @click="openAddTeamDialog">Add New Team</v-btn>

	<v-container>
		<v-row>
			<v-col
				v-for="team in teams"
				:key="team.id"
				cols="12"
				sm="6"
				md="4"
				lg="3"
			>
				<v-card class="flip-card d-flex flex-column justify-space-between h-100" @click="toggleFlip(team.id)">
					<v-card-text v-if="flippedCard !== team.id" class="front">
						<h3 class="text-center">{{ team.abbr }}</h3>
						<v-divider color="white" :thickness="3"></v-divider>
						<v-img
							v-if="team.logo"
							aspect-ratio="1"
							class="team-logo"
							:src="team.logo"
						/>
						<v-alert
							v-else
							type="info"
						>
							No logo available
						</v-alert>
						<v-divider color="white" :thickness="3"></v-divider>
						<div>
							<h4>{{ team.name }}</h4>
							<p>{{ team.mascot }}</p>
						</div>
					</v-card-text>

					<v-card-text v-else class="back">
						<p v-if="team.conference">
							<strong>Conference:</strong>
							{{ team.conference.name }}
						</p>
						<p v-else><strong>Conference:</strong> Independent</p>

						<p v-if="team.division">
							<strong>Division:</strong> {{ team.division.name }}
						</p>
						<p v-else><strong>Division:</strong> N/A</p>
						<p>
							<strong>City:</strong> {{ team.city }},
							{{ team.state }}
						</p>
						<p><strong>Country:</strong> {{ team.country }}</p>
						<p><strong>Stadium:</strong> {{ team.stadium }}</p>

						<p v-if="team.sponsors && team.sponsors.length">
							<strong>Sponsors:</strong>
							<ul style="padding-left: 1.5rem; margin: 0;">
								<li v-for="sponsor in team.sponsors" :key="sponsor.id">
									{{ sponsor.name }}
								</li>
							</ul>
						</p>
						<p v-else>
							<strong>Sponsors:</strong> None
						</p>

						<v-row class="mt-auto pt-3">
							<v-col cols="6">
								<v-btn
									color="primary"
									block
									@click.stop="editTeam(team.id)"
								>
									Edit
								</v-btn>
							</v-col>
							<v-col cols="6">
								<v-btn
									color="error"
									block
									@click.stop="confirmDelete(team.id)"
								>
									Delete
								</v-btn>
							</v-col>
						</v-row>

						<v-dialog v-model="editDialog" max-width="500px">
							<v-card color="gray">
								<v-card-title>Edit Team</v-card-title>
								<v-card-text>
									<v-form ref="editForm" v-model="isValid">
										<v-text-field
											v-model="editedTeam.name"
											label="Team Name*"
											:rules="[required]"
										></v-text-field>
										<v-text-field
											v-model="editedTeam.abbr"
											label="Abbreviation*"
											:rules="[required]"
										></v-text-field>
										<v-file-input
											accept="image/*"
											label="Team Logo"
											@change="onLogoChange"
										></v-file-input>
										<v-img
											v-if="editedTeam.logo"
											:src="editedTeam.logo"
											max-height="50"
										></v-img>
										<v-text-field
											v-model="editedTeam.mascot"
											:value="editedTeam.mascot"
											label="Mascot"
										></v-text-field>
										<v-select
											v-model="editedTeam.confId"
											:items="conferences"
											item-title="name"
											item-value="id"
											label="Conference"
										></v-select>
										<v-select
											v-model="editedTeam.divId"
											:items="availableDivisions"
											item-title="name"
											item-value="id"
											label="Division"
											:disabled="
												availableDivisions.length === 0
											"
										></v-select>
										<v-text-field
											v-model="editedTeam.city"
											label="City*"
											:rules="[required]"
										></v-text-field>
										<v-text-field
											v-model="editedTeam.state"
											label="State*"
											:rules="[required]"
										></v-text-field>
										<v-text-field
											v-model="editedTeam.country"
											label="Country*"
											:rules="[required]"
										></v-text-field>
										<v-text-field
											v-model="editedTeam.stadium"
											label="Stadium*"
											:rules="[required]"
										></v-text-field>
										<v-select
											v-model="editedTeam.sponsors"
											:items="sponsors"
											:multiple="true"
											item-title="name"
											item-value="id"
											label="Sponsors"
										></v-select>
										<v-alert
											v-if="errorMessage"
											type="error"
											dense
										>
											{{ errorMessage }}
										</v-alert>
									</v-form>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn text @click="editDialog = false"
										>Cancel</v-btn
									>
									<v-btn
										color="primary"
										:disabled="!isValid"
										:loading="isLoading"
										@click="updateTeam"
									>
										Update
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-dialog v-model="deleteDialog" max-width="400">
			<v-card>
				<v-card-title class="headline">Confirm Deletion</v-card-title>
				<v-card-text
					>Are you sure you want to delete this team?</v-card-text
				>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="grey darken-1"
						text
						@click="deleteDialog = false"
					>
						Cancel
					</v-btn>
					<v-btn
						color="red"
						text
						:loading="isLoading"
						@click="deleteTeam"
					>
						Delete
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Add Team Dialog -->
		<v-dialog v-model="addDialog" max-width="500px">
			<v-card color="gray">
				<v-card-title>Add New Team</v-card-title>
				<v-card-text>
					<v-form ref="addForm" v-model="isValidAdd">
						<v-text-field
							v-model="newTeam.name"
							label="Team Name*"
							:rules="[required]"
						></v-text-field>
						<v-text-field
							v-model="newTeam.abbr"
							label="Abbreviation*"
							:rules="[required]"
						></v-text-field>
						<v-file-input
							accept="image/*"
							label="Team Logo"
							@change="onLogoAdd"
						></v-file-input>
						<v-img
							v-if="newTeam.logo"
							:src="newTeam.logo"
							max-height="50"
						></v-img>
						<v-text-field
							v-model="newTeam.mascot"
							label="Mascot"
						></v-text-field>
						<v-select
							v-model="newTeam.confId"
							:items="conferences"
							item-title="name"
							item-value="id"
							label="Conference"
						></v-select>
						<v-select
							v-model="newTeam.divId"
							:items="availableDivisions"
							item-title="name"
							item-value="id"
							label="Division"
							:disabled="availableDivisions.length === 0"
						></v-select>
						<v-text-field
							v-model="newTeam.city"
							label="City*"
							:rules="[required]"
						></v-text-field>
						<v-text-field
							v-model="newTeam.state"
							label="State*"
							:rules="[required]"
						></v-text-field>
						<v-text-field
							v-model="newTeam.country"
							label="Country*"
							:rules="[required]"
						></v-text-field>
						<v-text-field
							v-model="newTeam.stadium"
							label="Stadium*"
							:rules="[required]"
						></v-text-field>
						<v-select
							v-model="sponsorIds"
							:items="sponsors"
							:multiple="true"
							item-title="name"
							item-value="id"
							label="Sponsors"
						></v-select>

						<v-alert v-if="errorMessageAdd" type="error" dense>
							{{ errorMessageAdd }}
						</v-alert>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text @click="addDialog = false">Cancel</v-btn>
					<v-btn
						color="primary"
						:disabled="!isValidAdd"
						@click="addTeam"
						:loading="isLoadingNewTeam"
					>
						Add
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-snackbar
			v-model="showSuccessSnackbar"
			color="success"
			timeout="3000"
		>
			{{ successMessage }}
			<v-btn text @click="showSuccessSnackbar = false">OK</v-btn>
		</v-snackbar>
	</v-container>
</template>

<script src="./TeamsView.ts"></script>
<style src="./TeamsView.scss"></style>
