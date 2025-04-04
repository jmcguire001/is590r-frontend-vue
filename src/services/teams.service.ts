import axios from "axios"
import authHeader from "./auth-header"
import API_URL from "./env"

class TeamsService {
	getTeams() {
		return axios
			.get(API_URL + "teams", { headers: authHeader() })
			.then((response) => response.data.data)
	}

	deleteTeam(id) {
		return axios.delete(API_URL + "teams/" + id, { headers: authHeader() })
	}

	updateTeam(team) {
		return axios
			.put(API_URL + "teams/" + team.id, team, { headers: authHeader() })
			.then((response) => {
				console.log("Team successfully updated", response.data)
				console.log("Updated team data:", response.data.data)
				return response.data.data // ✅ Now it is properly returned
			})
	}

	updateTeamLogo(formData, teamId) {
		return axios
			.post(API_URL + `teams/${teamId}/update_team_logo`, formData, {
				headers: authHeader("multipart")
			})
			.then((response) => {
				console.log("Logo successfully uploaded", response.data)
				console.log(API_URL + `teams/${teamId}/update_team_logo`)
				return response.data
			})
			.catch((error) => {
				console.error("Error uploading logo:", error)
				console.log(API_URL + `teams/${teamId}/update_team_logo`)
				return Promise.reject(error)
			})
	}

	addTeam(teamData) {
		// Make the API call to add the team
		return axios
			.post(API_URL + "teams", teamData, {
				headers: authHeader("multipart") // Ensure this sets Content-Type to multipart/form-data
			})
			.then((response) => {
				return response.data
			})
			.catch((error) => {
				console.error("Error adding team:", error)
				return Promise.reject(error)
			})
	}
}

const teamsService = new TeamsService()
export default teamsService
