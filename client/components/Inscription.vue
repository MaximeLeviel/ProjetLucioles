<template>
  <div v-if="maraude!=null">
    <h3>{{maraude.nom}}</h3>
    <p>Date: {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} </p>
    <p>Heure: {{maraude.heure}}</p>
    <p>Lieu de départ: {{maraude.depart}}</p>
    <p>Lieu d'arrivée: {{maraude.arrivee}}</p>
    <p>Nombre de places encore disponibles: {{placesRestantes(maraude.nombre_volontaires, maraude.nombre_participants)}}/{{maraude.nombre_participants}} </p>

    
    <input type="text" v-model="email" placeholder="Entrez votre email" required>
    
    <button @click="verifierEmail">Valider</button>
  </div>
</template>


<script>
module.exports = {
  data () {
    return {
        maraude: null,
        email: '',
    }
  },

  created: async function() {
    var maraudeId = this.$route.params.id
    const result = await axios.get('/api/maraude/' + maraudeId)
    console.log(result)
    this.maraude = result.data[0]
    console.log(this.maraude)
  },

  methods: {
    placesRestantes(placesPrises, placesTotales){
        return placesTotales - placesPrises
    },
    verifierEmail(){

    }
  }
}
</script>

<style scoped>
</style>