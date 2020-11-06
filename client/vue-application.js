const Home = window.httpVueLoader('./components/Home.vue')
const Inscription = window.httpVueLoader('./components/Inscription.vue')
const Admin = window.httpVueLoader('./components/Admin.vue')

const AdminMaraudes = window.httpVueLoader('./components/admin/Maraudes.vue')
const AdminDoleances = window.httpVueLoader('./components/admin/Doleances.vue')
const AdminUtilisateurs = window.httpVueLoader('./components/admin/Utilisateurs.vue')
const AdminAdmins = window.httpVueLoader('./components/admin/Admins.vue')

const AdminGestionMaraudes = window.httpVueLoader('./components/admin/maraudes/Maraudes.vue')
const AdminNouvelleMaraude =  window.httpVueLoader('./components/admin/maraudes/NouvelleMaraude.vue')
const AdminGestionTrajets = window.httpVueLoader('./components/admin/maraudes/Trajets.vue')

const routes = [
  { path: '/', component: Home},
  { path: '/inscription', component: Inscription },
  { path: '/admin', component: Admin,
    children: [
      {path: 'maraudes', component: AdminMaraudes,
        children: [
          {path: 'maraudes', component: AdminGestionMaraudes,
            children:[
              {path: 'new', component: AdminNouvelleMaraude}
            ]
          },
          {path: 'trajets', component: AdminGestionTrajets}
        ]},
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
