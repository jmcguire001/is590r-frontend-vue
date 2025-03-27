import { mapState } from "vuex"
import { useDisplay } from "vuetify"

export default {
	name: "TeamsView",
	computed: {
		...mapState({
			teams() {
				return this.$store.state.team.teamsList
			}
		})
	},
	created() {
		this.getTeams()
	},
	methods: {
		toggleFlip(teamId) {
			this.flippedCard = this.flippedCard === teamId ? null : teamId
		},
		getTeams() {
			this.$store.dispatch("team/getTeams").then(() => {
				this.isLoadingTeams = false
			})
		}
	},
	data() {
		return {
			flippedCard: null,
			isLoadingTeams: true
		}
	}
}
