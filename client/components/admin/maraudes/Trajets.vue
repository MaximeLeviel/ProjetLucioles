<template>
  <div>
      <h2>Trajets</h2>
      <hr>
    <div v-for="trajet in trajets" :key="trajet.trajet_id" class="trajet">
        <h3>{{trajet.nom_trajet}}</h3>
        <p>Départ : {{trajet.depart}}</p>
        <p>Arrivée : {{trajet.arrivee}}</p>
    </div>
    <router-view></router-view>
  </div>
</template>


<script>
module.exports = {
    data () {
        return {
            trajets: null
        }
    },

    created: async function(){
        const result = await axios.get('/api/trajets')
        this.trajets = result.data
    },
}
</script>

<style scoped>
.trajet{
    background-color: rgb(248, 248, 248);
    border-radius: 10px;
    width: 40%;
    margin: auto;
    margin-top: 20px;
    padding: 20px;
}

.trajet:last-child {
    margin-bottom: 30px;
}

h2 {
  font-family: 'open sans', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica-Neue', Helvetica, Arial, sans-serif;
  font-size: 28px;
  line-height: 1.1em;
  margin-bottom: 10px;
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  text-align: center;
  text-transform: uppercase;
  color: #fff;
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

h3 {
    text-align: center;
    text-transform: uppercase;
    font-size: 24px;
}
</style>