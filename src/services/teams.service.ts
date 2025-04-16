import axios from "axios"
import authHeader from "./auth-header"
import API_URL from "./env"

class TeamsService {
	getTeams() {
		return axios
			.get(API_URL + "teams", { headers: authHeader() })
			.then((response) => response.data.data)
	}

	getConferences() {
		return axios
			.get(API_URL + "teams/conferences", { headers: authHeader() })
			.then((response) => response.data.data)
	}

	getSponsors() {
		return axios
			.get(API_URL + "teams/sponsors", { headers: authHeader() })
			.then((response) => response.data.data)
	}

	getStadiums() {
		return axios
			.get(API_URL + "teams/stadiums", { headers: authHeader() })
			.then((response) => response.data.data)
	}

	deleteTeam(id) {
		return axios.delete(API_URL + "teams/" + id, { headers: authHeader() })
	}

	updateTeam(team) {
		return axios
			.put(API_URL + "teams/" + team.id, team, { headers: authHeader() })
			.then((response) => {
				return response.data.data
			})
	}

	updateTeamLogo(formData, teamId) {
		return axios
			.post(API_URL + `teams/${teamId}/update_team_logo`, formData, {
				headers: authHeader("multipart")
			})
			.then((response) => {
				return response.data
			})
			.catch((error) => {
				console.error("Error uploading logo:", error)
				return Promise.reject(error)
			})
	}

	addTeam(teamData) {
		// Make the API call to add the team
		return axios
			.post(API_URL + "teams", teamData, {
				headers: authHeader("multipart")
			})
			.then((response) => {
				return response.data.data.team
			})
			.catch((error) => {
				console.error("Error adding team:", error)
				return Promise.reject(error)
			})
	}

	checkStadium(name) {
		return axios
			.get(API_URL + "stadiums/check", {
				params: { name },
				headers: authHeader()
			})
			.then((response) => {
				console.log("Stadium check response:", response.data.status)
				return response.data.data
			}) // assuming your API returns `{ exists: true/false }`
	}
}

const teamsService = new TeamsService()
export default teamsService
