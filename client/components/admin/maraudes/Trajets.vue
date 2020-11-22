<template>
  <div>
      <h2>Trajets</h2>
      <hr>
    <div v-for="trajet in trajets" :key="trajet.trajet_id" class="trajet">
        <h3><span>{{trajet.nom_trajet}}</span></h3>
        <p>Départ : {{trajet.depart}}</p>
        <p>Arrivée : {{trajet.arrivee}}</p>
        <p>Trajet :</p>
        <ul>
            <li v-for="(etape, index) in trajet.trajet" :key="index">{{etape}}</li>
        </ul>
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
        console.log(this.trajets.trajet)
    },
}
</script>

<style scoped>
.trajet{
    background-color: rgb(248, 248, 248);
    border-radius: 10px;
    width: 480px;
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
    color: #33383b; 
    font-family: 'Open Sans', sans-serif; 
    font-size: 30px; 
    font-weight: 300; 
    line-height: 0.1em;
    margin: 30px 0 30px;
    text-align: center; 
    text-transform: uppercase;

    width: 100%;
    border-bottom: 2px solid orange; 
}
 
h3 span { 
    background: rgb(248, 248, 248); 
    padding:0 10px; 
}

ul {
    margin-left: 40px;
}
</style>