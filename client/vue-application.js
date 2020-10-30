const Home = window.httpVueLoader('./components/Home.vue')
const Inscription = window.httpVueLoader('./components/Inscription.vue')
const Admin = window.httpVueLoader('./components/Admin.vue')

const AdminMaraudes = window.httpVueLoader('./components/admin/Maraudes.vue')
const AdminDoleances = window.httpVueLoader('./components/admin/Doleances.vue')
const AdminUtilisateurs = window.httpVueLoader('./components/admin/Utilisateurs.vue')
const AdminAdmins = window.httpVueLoader('./components/admin/Admins.vue')

const routes = [
  { path: '/', component: Home},
  { path: '/inscription', component: Inscription },
  { path: '/admin', component: Admin,
    children: [
      {path: '/', component: AdminMaraudes},
      {path: 'doleances', component: AdminDoleances },
      {path: 'utilisateurs', component: AdminUtilisateurs},
      {path: 'admins', component: AdminAdmins}] },
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    articles: [],
  },

  methods: {
    selectMaraude(maraude){
      
    }
  }
})
