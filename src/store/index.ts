import { createStore } from "vuex"
import { auth } from "./auth.module"
import { user } from "./user.module"
import { team } from "./teams.module"
const store = createStore({
	modules: {
		auth,
		user,
		team
	}
})

export default store
