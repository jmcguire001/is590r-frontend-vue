import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../views/home/HomeView.vue"),
			alias: "/home"
		},
		{
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import("../views/about/AboutView.vue")
		},
		{
			path: "/teams",
			name: "teams",
			component: () => import("../views/teams/TeamsView.vue")
		}
	]
})

export default router
