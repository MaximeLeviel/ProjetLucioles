<template>
  <div v-if="maraude!=null">
    <h3>{{maraude.nom}}</h3>
    <p>Date: {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} </p>
    <p>Heure: {{maraude.heure}}</p>
    <p>Lieu de départ: {{maraude.depart}}</p>
    <p>Lieu d'arrivée: {{maraude.arrivee}}</p>
    <p>Nombre de places encore disponibles: {{placesRestantes(maraude.nombre_volontaires, maraude.nombre_participants)}}/{{maraude.nombre_participants}} </p>

    
    <form @submit.prevent="verifierEmail" v-if="isUserConnu">
        <h3>Entrez votre email pour vous inscrire</h3>
        <input type="text" v-model="email" placeholder="Entrez votre email" required>

        <button type="submit">S'inscrire</button>
    </form>
    <form @submit.prevent="inscrireUser" v-else>
        <h3>Entrez vos informations complémentaires</h3>
        <input type="text" v-model="email" placeholder="Entrez votre email" disabled="disabled" required>
        <input type="text" v-model="nom" placeholder="Entrez votre nom" required>
        <input type="text" v-model="prenom" placeholder="Entrez votre prénom" required>
        <input type="text" v-model="phone" placeholder="Entrez votre numéro de téléphone" required>

        <button type="submit">S'incrire</button>
    </form>

  </div>
</template>


<script>
module.exports = {
  data () {
    return {
        maraude: null,
        isUserConnu: true,
        email: '',
        nom: '',
        prenom: '',
        phone: '',
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
    async verifierEmail(){
      const inscription = {
        email: this.email,
        id: this.maraude.id
      }
      const result = await axios.post('/api/email', inscription)
      if (result.data.connu === false){
        this.isUserConnu = false 
      }
      else{
        alert(result.data.message)
      }
    },
    async inscrireUser(){
      const inscription = {
        email: this.email,
        nom: this.nom,
        prenom: this.prenom,
        phone: this.phone,
        id: this.maraude.maraude_id,
      }
      const result = await axios.post('/api/participant', inscription)
      alert(result.data.message)
    }
  }
}
</script>

<style scoped>
</style>