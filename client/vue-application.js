const Home = window.httpVueLoader('./components/Home.vue')
const Inscription = window.httpVueLoader('./components/Inscription.vue')
const Admin = window.httpVueLoader('./components/Admin.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/inscription', component: Inscription },
  { path: '/admin', component: Admin },
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
