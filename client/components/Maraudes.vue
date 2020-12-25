<template>
  <div class="main">
    <h2>Cliquez sur une maraude pour vous inscrire !</h2>
    <hr>
    <div class="maraude" v-for="maraude in maraudes" :key="maraude.maraude_id">
      <div v-if="placesRestantes(maraude.nombre_volontaires, maraude.nombre_participants) == 0">
        <h3>{{maraude.nom_maraude}}</h3>
          <p>Date: {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} </p>
          <p>Heure: {{maraude.heure}}</p>
          <p>Lieu de départ: {{maraude.depart}}</p>
          <p>Lieu d'arrivée: {{maraude.arrivee}}</p>
          <p>Plus de place disponible.</p>
      </div>
      <div v-else>
        <router-link :to="chemin(maraude)">
            <h3>{{maraude.nom_maraude}}</h3>
            <p>Date: {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} </p>
            <p>Heure: {{maraude.heure}}</p>
            <p>Lieu de départ: {{maraude.depart}}</p>
            <p>Lieu d'arrivée: {{maraude.arrivee}}</p>
            <p>Nombre de places disponibles: {{placesRestantes(maraude.nombre_volontaires, maraude.nombre_participants)}}/{{maraude.nombre_participants}} </p>
        </router-link>
      </div>
    </div>
  </div>
</template>


<script>
module.exports = {
  props: {
    
  },
  data () {
    return {
      maraudes: null,
      test: 5,
    }
  },

  created: async function() {
    const result = await axios.get('/api/maraudesTrajets')
    this.maraudes = result.data
  },

  methods: {
    placesRestantes(placesPrises, placesTotales){
      return placesTotales - placesPrises
    },
    chemin(maraude){
      return "/inscription/maraude/" + maraude.maraude_id
    }
  }
}
</script>

<style scoped>

a {
  text-decoration: none;
}

.main {
  padding-top: 30px;
  padding-bottom: 20px;
  padding-left: 0;
  padding-right: 0;
}

.maraude {
  background-color: #fff;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  width: 480px;
  border-radius: 10px;
  color: black;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 50px;
  padding-right: 50px;
  text-decoration: none!important;
}

.maraude p {
  color: black;
  text-decoration: underline;
  text-decoration-color:#fff;
  text-decoration-thickness: 0px;
  border-bottom: 0px solid #fff;
  margin-bottom: 5px;
  text-decoration: none!important;
}

h3 {
  text-align: center;
  color: #007cba;
  font-size: 30px;
  font-weight: 300;

  line-height: 0.1em;
  text-align: center;
  width: 100%;
  display: block;
  padding-bottom: 54px;
  
  text-decoration: underline;
  text-decoration-color:#fff;
  text-decoration-thickness: 0px;
  border-bottom: 0px solid #fff;
  text-transform: uppercase;
  margin: 30px 0 30px;
  border-bottom: 2px solid orange; 
  font-family: 'open sans', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica-Neue', Helvetica, Arial, sans-serif;
}
 
h3 span { 
  background: rgb(248, 248, 248); 
  padding:0 10px; 
}

hr {
  display: block;
  border: 0;
  border-radius: 3em;
  border-top: 2px solid orange;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 10%;
  margin: auto;
}

h2 {
  font-family: 'open sans', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica-Neue', Helvetica, Arial, sans-serif;
  font-size: 28px;
  line-height: 1.1em;
  margin-bottom: 30px;
  display: block;
  font-size: 1.5em;
  text-align: center;
  text-transform: uppercase;
  color: #fff;
}

@media only screen and (max-width: 900px) {
  .maraude {
    width: 90%;
  }
}

</style>
