import { createStore } from "vuex"
import { auth } from "./auth.module"

const store = createStore({
	modules: {
		auth
	}
})

// There must be an export in order to import it
export default store
