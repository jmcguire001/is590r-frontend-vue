import teamsService from "../services/teams.service"

const initialState = { teamsList: [] }

export const team = {
	namespaced: true,
	state: initialState,
	actions: {
		getTeams({ commit }) {
			return teamsService.getTeams().then((teams) => {
				commit("setTeams", teams)
				return Promise.resolve(teams)
			})
		},
		returnTeams({ commit, getters }, team) {}
	},
	mutations: {
		setTeams(state, teams) {
			state.teamsList = teams
		}
	},
	getters: {
		getTeamIndexByTeamID: (state) => (teamID) => {
			return state.teamsList.findIndex((team) => {
				return team.id === teamID
			})
		}
	}
}
