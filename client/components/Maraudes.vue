<template>
  <div>
    <div v-for="maraude in maraudes" :key="maraude.maraude_id" class="maraude">
        <router-link :to="chemin(maraude)">
            <h3>{{maraude.nom}}</h3>
            <p>Date: {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} </p>
            <p>Heure: {{maraude.heure}}</p>
            <p>Lieu de départ: {{maraude.depart}}</p>
            <p>Lieu d'arrivée: {{maraude.arrivee}}</p>
            <p>Nombre de places encore disponibles: {{placesRestantes(maraude.nombre_volontaires, maraude.nombre_participants)}}/{{maraude.nombre_participants}} </p>
        </router-link>
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
.maraude{
    background-color: rgb(248, 248, 248);
    margin: 2px;
    border-radius: 10px;
    color: black;
}

article {
  display: flex;
}

.article-img {
  flex: 1;
}

.article-img div {

  max-height: 100%;
  width: auto;
  background-size: cover;
  border-style: solid;
  border-width: 2px;
}

.article-content {
  flex: 3;
}

.article-title {
  display: flex;
  justify-content: space-between;
}

textarea {
  width: 100%;
}
</style>
