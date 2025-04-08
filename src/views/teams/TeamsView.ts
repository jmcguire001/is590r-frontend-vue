import { mapState } from "vuex"
import teamsService from "../services/teams.service"

export default {
	name: "TeamsView",
	computed: {
		...mapState({
			teams() {
				return this.$store.state.team.teamsList
			},
			conferences() {
				return this.$store.state.team.conferencesList
			}
		})
	},
	data() {
		return {
			flippedCard: null,
			isLoadingTeams: true,
			deleteDialog: false,
			editDialog: false,
			addDialog: false, // New dialog for adding teams
			selectedTeamId: null,
			showSuccessSnackbar: false,
			successMessage: "",
			errorMessage: "",
			errorMessageAdd: "", // New error message for add team
			newTeam: {}, // New team data object
			isValidAdd: true, // Validation flag for the add form
			isLoadingNewTeam: false,
			isLoading: false,
			availableDivisions: [],
			editedTeam: {}
		}
	},
	created() {
		this.getTeams()
		this.getConferences()
	},
	methods: {
		// Toggle Flip
		toggleFlip(teamId: number) {
			this.flippedCard = this.flippedCard === teamId ? null : teamId
		},

		// Fetch teams from Vuex store
		getTeams() {
			this.$store.dispatch("team/getTeams").then(() => {
				this.isLoadingTeams = false
			})
		},

		getConferences() {
			this.$store.dispatch("team/getConferences").then(() => {
				this.isLoadingTeams = false
			})
		},

		addDivision() {
			const selectedConf = this.conferences.find(
				(conf) => conf.id === this.newTeam.confId
			)

			if (
				selectedConf &&
				selectedConf.divisions &&
				selectedConf.divisions.length > 0
			) {
				this.availableDivisions = selectedConf.divisions
			} else {
				// If no divisions or conference has no divisions
				this.availableDivisions = []
				this.newTeam.divId = null // Reset division selection
			}
		},

		updateDivision() {
			// Clear the available divisions list
			this.availableDivisions = []

			const selectedConf = this.conferences.find(
				(conf) => conf.id === this.editedTeam.confId
			)

			if (
				selectedConf &&
				selectedConf.divisions &&
				selectedConf.divisions.length > 0
			) {
				// If the selected conference has divisions, keep divId if it's valid for the new conference
				this.availableDivisions = selectedConf.divisions

				// If the divId is invalid for this conference (not present in available divisions), reset it
				if (
					!this.availableDivisions.some(
						(div) => div.id === this.editedTeam.divId
					)
				) {
					this.editedTeam.divId = null
				}
			} else {
				// If no divisions exist, reset divId
				this.editedTeam.divId = null
			}
		},

		// Show Delete Confirmation Dialog
		confirmDelete(id: number) {
			this.selectedTeamId = id
			this.deleteDialog = true
		},

		// Delete Team
		deleteTeam() {
			if (!this.selectedTeamId) return

			this.isLoading = true

			this.$store
				.dispatch("team/deleteTeam", this.selectedTeamId)
				.then(() => {
					this.deleteDialog = false
					this.successMessage = "Team successfully deleted."
					this.showSuccessSnackbar = true
					this.isLoading = false
				})
				.catch((error) => {
					console.error("Error deleting team:", error)
				})
		},

		// Open edit dialog with team data
		editTeam(teamId: number) {
			const team = this.teams.find((t) => t.id === teamId)
			if (!team) return

			this.isValid = true
			this.editedTeam = { ...team } // Create a shallow copy of the team object
			this.editDialog = true
		},

		onLogoChange(event) {
			const file = event.target.files[0] // Extract the first selected file

			if (!file) return

			// Update UI preview immediately
			this.editedTeam.logo = URL.createObjectURL(file)

			// Ensure FormData contains a valid File object
			const formData = new FormData()
			formData.append("logo", file) // Make sure `file` is a File object
			formData.append("teamId", this.editedTeam.id)

			// Dispatch the action to update the logo
			this.$store.dispatch("team/updateTeamLogo", {
				formData,
				teamId: this.editedTeam.id
			})
		},

		// Update Team
		updateTeam() {
			if (!this.editedTeam) return

			this.isLoading = true

			this.$store
				.dispatch("team/updateTeam", this.editedTeam)
				.then(() => {
					this.editDialog = false
					this.successMessage = "Team successfully updated."
					this.showSuccessSnackbar = true
					this.isLoading = false
					this.getTeams() // Refresh the teams list after update
				})
				.catch((error) => {
					this.errorMessage = "Error updating team."
					console.error("Error updating team:", error)
				})
		},

		openAddTeamDialog() {
			this.newTeam = {} // Reset the new team form data
			this.addDialog = true
		},

		// Handle file selection for team logo (add)
		onLogoAdd(event) {
			const file = event.target.files[0]

			if (!file) return

			if (file) {
				this.newTeam.logo = file // Store the file directly, not the base64 data
			}
		},

		// Add New Team
		addTeam() {
			const formData = new FormData()

			// Add other team data to formData
			formData.append("name", this.newTeam.name)
			formData.append("abbr", this.newTeam.abbr)
			formData.append("confId", this.newTeam.confId)
			formData.append("city", this.newTeam.city)
			formData.append("state", this.newTeam.state)
			formData.append("country", this.newTeam.country)
			formData.append("stadium", this.newTeam.stadium)
			formData.append("mascot", this.newTeam.mascot)

			if(!this.newTeam.confId) {
				this.newTeam.confId = null
			}

			if (!this.newTeam.divId) {
				this.newTeam.divId = null
			}

			// Ensure the logo is added as a File
			if (this.newTeam.logo) {
				formData.append("logo", this.newTeam.logo)
			}

			this.isLoadingNewTeam = true

			// Send the form data to the API
			this.$store
				.dispatch("team/addTeam", formData)
				.then(() => {
					this.addDialog = false
					this.successMessage = "Team successfully added."
					this.showSuccessSnackbar = true
					this.isLoadingNewTeam = false
				})
				.catch((error) => {
					this.errorMessageAdd = "Error adding team."
					console.error("Error adding team:", error)
				})
		}
	},
	watch: {
		"newTeam.confId": function () {
			this.addDivision()
		},
		"editedTeam.confId": function () {
			this.updateDivision()
		}
	}
}
