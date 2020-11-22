const Home = window.httpVueLoader('./components/Home.vue')
const Maraudes = window.httpVueLoader('./components/Maraudes.vue')
const Admin = window.httpVueLoader('./components/Admin.vue')
const Inscription = window.httpVueLoader('./components/Inscription.vue')

const AdminMaraudes = window.httpVueLoader('./components/admin/MaraudesGestion.vue')
const AdminUtilisateurs = window.httpVueLoader('./components/admin/Utilisateurs.vue')
const AdminAdmins = window.httpVueLoader('./components/admin/Admins.vue')

const AdminGestionMaraudes = window.httpVueLoader('./components/admin/maraudes/MaraudesAdmin.vue')
const AdminNouvelleMaraude =  window.httpVueLoader('./components/admin/maraudes/NouvelleMaraude.vue')
const AdminGestionTrajets = window.httpVueLoader('./components/admin/maraudes/Trajets.vue')
const AdminNouveauTrajet = window.httpVueLoader('./components/admin/maraudes/NouveauTrajet.vue')
const AdminChangeMaraude = window.httpVueLoader('./components/admin/maraudes/ModifierMaraude.vue')

const routes = [
  { path: '/', component: Home},
  { path: '/maraudes', component: Maraudes },
  { path: '/admin', component: Admin,
    children: [
      {path: 'maraudes', component: AdminMaraudes,
        children: [
          {path: 'maraudes', component: AdminGestionMaraudes},
          {path: 'new', component: AdminNouvelleMaraude},
          {path: 'trajets', component: AdminGestionTrajets},
          {path: 'trajet/new', component: AdminNouveauTrajet},
          {path: 'change/:id', component: AdminChangeMaraude},
        ]},
      {path: 'utilisateurs', component: AdminUtilisateurs},
      {path: 'admins', component: AdminAdmins}] },
  { path: '/inscription/maraude/:id', component: Inscription}
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
  }
})
