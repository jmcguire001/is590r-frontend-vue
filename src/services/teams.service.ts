import axios from "axios"
import authHeader from "./auth-header"
import API_URL from "./env"

class TeamsService {
	getTeams() {
		return axios
			.get(API_URL + "teams", { headers: authHeader() })
			.then((response) => {
				return response.data.data
			})
	}

	returnTeams(team) {
		return axios.patch(
			API_URL + "teams/" + team.id + "/return",
			{},
			{ headers: authHeader() }
		)
	}
}

const teamsService = new TeamsService()
export default teamsService
