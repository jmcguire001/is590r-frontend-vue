import teamsService from "../services/teams.service"

const initialState = { teamsList: [] }

export const team = {
	namespaced: true,
	state: {
		teamsList: []
	},
	actions: {
		getTeams({ commit }) {
			return teamsService.getTeams().then((teams) => {
				commit("setTeams", teams)
				return Promise.resolve(teams)
			})
		},

		deleteTeam({ commit }, id) {
			return teamsService.deleteTeam(id).then(() => {
				commit("removeTeam", id)
			})
		},

		updateTeam({ commit }, team) {
			return teamsService.updateTeam(team).then((updatedTeam) => {
				commit("editTeam", updatedTeam)
			})
		},

		updateTeamLogo({ commit }, { formData, teamId }) {
			return teamsService
				.updateTeamLogo(formData, teamId)
				.then((response) => {
					return Promise.resolve(response)
				})
		},

		addTeam({ commit }, team) {
			if (!team.divId) {
				team.divId = null
			}

			return teamsService.addTeam(team).then((newTeam) => {
				commit("addTeam", newTeam)
			})
		}
	},

	mutations: {
		setTeams(state, teams) {
			state.teamsList = teams
		},
		removeTeam(state, id) {
			state.teamsList = state.teamsList.filter((team) => team.id !== id)
		},
		editTeam(state, updatedTeam) {
			const index = state.teamsList.findIndex(
				(t) => t.id === updatedTeam.id
			)
			if (index !== -1) {
				state.teamsList.splice(index, 1, updatedTeam)
			}
		},
		addTeam(state, newTeam) {
			state.teamsList.push(newTeam)
		}
	}
}
