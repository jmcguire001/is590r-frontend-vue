import _ from "lodash"
import { mapState } from "vuex"
import teamsService from "../services/teams.service"
import { get } from "http"

export default {
	name: "TeamsView",
	computed: {
		...mapState({
			teams() {
				return this.$store.state.team.teamsList
			},
			conferences() {
				return this.$store.state.team.conferencesList
			},
			sponsors() {
				return this.$store.state.team.sponsorsList
			},
			stadiums() {
				return this.$store.state.team.stadiumsList
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
			sponsorIds: [],
			editedTeam: {},
			stadiumInUse: false,
			stadiumError: ""
		}
	},
	created() {
		this.getTeams()
		this.getConferences()
		this.getSponsors()
		this.getStadiums()
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

		getSponsors() {
			this.$store.dispatch("team/getSponsors").then(() => {
				this.isLoadingTeams = false
			})
		},

		getStadiums() {
			this.$store.dispatch("team/getStadiums").then(() => {
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
			this.editedTeam.stadiumName = team.stadium.name
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
		async updateTeam() {
			if (!this.editedTeam) return

			await this.validateEditedStadium() // Validate stadium before proceeding

			this.isLoading = true

			if (
				this.editedTeam.sponsors &&
				Array.isArray(this.editedTeam.sponsors)
			) {
				// Ensure you're sending only IDs
				const sponsorIds = this.editedTeam.sponsors.map(
					(s) => s.id ?? s
				) // Handles both objects and raw IDs
				this.editedTeam.sponsorIds = JSON.stringify(sponsorIds)
				delete this.editedTeam.sponsors
			}

			console.log("Sponsor IDs:", this.editedTeam.sponsorIds)

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
			this.sponsorIds = [] // Reset selected sponsors
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
		async addTeam() {
			await this.validateStadium() // Validate stadium before proceeding

			if (!this.isValidAdd) {
				this.isLoadingNewTeam = false
				return
			}

			const formData = new FormData()

			// Add required fields
			formData.append("name", this.newTeam.name)
			formData.append("abbr", this.newTeam.abbr)
			formData.append("city", this.newTeam.city)
			formData.append("state", this.newTeam.state)
			formData.append("country", this.newTeam.country)
			formData.append("stadium", this.newTeam.stadium)
			formData.append("mascot", this.newTeam.mascot ?? "")

			// Handle nullable select fields properly
			if (
				this.newTeam.confId !== undefined &&
				this.newTeam.confId !== null
			) {
				formData.append("confId", this.newTeam.confId)
			}

			if (
				this.newTeam.divId !== undefined &&
				this.newTeam.divId !== null
			) {
				formData.append("divId", this.newTeam.divId)
			}

			// Handle logo and sponsors
			if (this.newTeam.logo) {
				formData.append("logo", this.newTeam.logo)
			}

			// Modify this section in your addTeam method
			if (this.sponsorIds && this.sponsorIds.length > 0) {
				formData.append("sponsorIds", JSON.stringify(this.sponsorIds))
			} else {
				// Ensure we send an empty array when no sponsors are selected
				formData.append("sponsorIds", JSON.stringify([]))
			}

			formData.append("sponsorIds", JSON.stringify(this.sponsorIds))

			this.isLoadingNewTeam = true

			// Send the form data to the API
			this.$store
				.dispatch("team/addTeam", formData)
				.then(() => {
					this.addDialog = false
					this.successMessage = "Team successfully added."
					this.showSuccessSnackbar = true
					this.isLoadingNewTeam = false
					this.getTeams()
				})
				.catch((error) => {
					this.errorMessageAdd = "Error adding team."
					console.error("Error adding team:", error)
				})
		},

		async validateStadium() {
			if (!this.newTeam.stadium) {
				this.stadiumError = "Stadium is required."
				this.isValidAdd = false
				return
			}

			try {
				const exists = await this.$store.dispatch(
					"team/checkStadium",
					this.newTeam.stadium
				)

				if (exists == "new" || exists == "available") {
					this.stadiumError = ""
				} else {
					this.stadiumError = "Stadium already exists and is in use."
				}
			} catch (error) {
				this.stadiumError = "Could not validate stadium."
			}
		},

		async validateEditedStadium() {
			if (!this.editedTeam.stadiumName) {
				this.stadiumError = "Stadium is required."
				this.isValid = false
				return
			}

			try {
				const exists = await this.$store.dispatch(
					"team/checkStadiumEdit",
					this.editedTeam.stadiumName
				)

				if (exists == "new" || exists == "available") {
					this.stadiumError = ""
				} else {
					const $stadiumNameTeam = this.teams.find(
						(t) => t.id === this.editedTeam.id
					).stadium.name

					if (this.editedTeam.stadiumName == $stadiumNameTeam) {
						this.stadiumError = ""
					} else {
						this.stadiumError =
							"Stadium already exists and is in use."
					}
				}
			} catch (error) {
				this.stadiumError = "Could not validate stadium."
			}
		},

		required(v) {
			return !!v || "Field is required"
		},

		stadiumAvailable(v) {
			return !this.stadiumError || this.stadiumError // If no error, pass; otherwise, show the error
		}
	},
	watch: {
		"newTeam.confId": function () {
			this.addDivision()
		},
		"editedTeam.confId": function () {
			this.updateDivision()
		},
		"newTeam.stadium": {
			handler: _.debounce(function () {
				this.validateStadium()
			}, 500),
			immediate: false
		},
		"editedTeam.stadiumName": {
			handler: _.debounce(function () {
				this.validateEditedStadium()
			}, 500),
			immediate: false
		}
	}
}
