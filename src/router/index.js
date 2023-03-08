import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from "@/components/WelcomePage"
import LoginPage from "@/components/LoginPage"
import Borne from "@/components/dashboard/Bornes"
import auth from './../services/auth.js'
import DashboardPage from "@/components/dashboard/DashboardPage";
import Stations from "@/components/dashboard/Stations";
import ClientsPage from "@/components/dashboard/Clients";
import Employees from "@/components/dashboard/Employees";
import StationAdmins from "@/components/dashboard/StationAdmins";
import Services from "@/components/dashboard/Services";
import AdsPage from "@/components/dashboard/Ads";
import WorkSchedules from "@/components/dashboard/WorkSchedules";
import Analytics from "@/components/dashboard/Analytics";

const routes = [
    {
        path: '/',
        redirect: "/home",
        name: 'home'
    },
    {
        path: '/dashboard',
        name: "dashboard",
        component: DashboardPage,
        redirect: "/dashboard/stations",
        children: [{
            path: 'bornes/:id',
            name: 'bornes',
            components: {
                default: DashboardPage,
                second: Borne
            }
            // component: ()=>
            //     import('view/view.vue') //lazy loading
        },
            {
                path: 'stations',
                name: 'stations',
                components: {
                    default: DashboardPage,
                    second: Stations
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },

            {
                path: 'clients',
                name: 'clients',
                components: {
                    default: DashboardPage,
                    second: ClientsPage
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'employees',
                name: 'employees',
                components: {
                    default: DashboardPage,
                    second: Employees
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'stationAdmins',
                name: 'stationAdmins',
                components: {
                    default: DashboardPage,
                    second: StationAdmins
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'services',
                name: 'services',
                components: {
                    default: DashboardPage,
                    second: Services
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'workSchedules',
                name: 'workSchedules',
                components: {
                    default: DashboardPage,
                    second: WorkSchedules
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'ads',
                name: 'ads',
                components: {
                    default: DashboardPage,
                    second: AdsPage
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'analytics',
                name: 'analytics',
                components: {
                    default: DashboardPage,
                    second: Analytics
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
        ]
    },
    {
        path: '/welcome',
        component:WelcomePage,
        name: "welcome"
        // component: ()=>
        //     import('view/view.vue') //lazy loading
    },
    {
        path: '/home',
        component:WelcomePage,
        name: "home"
        // component: ()=>
        //     import('view/view.vue') //lazy loading
    },
    {
        path: '/login',
        component:LoginPage,
        name: "login"
        // component: ()=>
        //     import('view/view.vue') //lazy loading
    },
    {
        path: '/',
        redirect:'/welcome'
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
router.beforeEach((to, from, next)=>{
    if(auth.actions.getToken() == null) {
        //Not authenticated
            if(to.name !== 'login' && to.name !== "welcome" && to.name !=="home")
                next({ name: 'login' });

    } else {
        //Authenticated

        if(to.name === 'login' || to.name === "welcome") {
            if(auth.actions.getUserType() === "client" || auth.actions.getUserType() === "employee") {
                if(to.name !== "home") {
                    next({ name: 'home' });
                }
        } else {
                if(to.name !== "dashboard") {
                    next({ name: 'dashboard' });
                }
            }
        }

        if(auth.actions.getUserType() === "client" || auth.actions.getUserType() === "employee") {
            if(to.path.startsWith("/dashboard")) {
                next({ name: 'home' });
            }
        } else {
            if(to.path.startsWith("/home")) {
                next({ name: 'dashboard' });
            }
        }
    }
    next();
});

export default router