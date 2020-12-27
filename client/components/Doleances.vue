<template>
  <div class="main">
    <h2>Cliquez sur une doléance pour signaler que vous l'apportez !</h2>
    <hr>
    <div v-for="doleance in doleances" :key="doleance.id" class="doleance">
      <h3>{{doleance.objet}}</h3>
      <p>{{doleance.description}}</p>
      <p>{{doleance.nom_trajet}}</p>
      <p>{{doleance.lieu}}</p>
    </div>
  </div>
</template>


<script>
module.exports = {
  data () {
    return {
      doleances: null,
    }
  },

  created: async function() {
    const result = await axios.get('/api/doleances')
    this.doleances = result.data
  },
}
</script>

<style scoped>

.main {
  padding-top: 30px;
  padding-bottom: 20px;
  padding-left: 0;
  padding-right: 0;
}

.doleance {
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
  text-decoration: none;
}

.doleance p {
  color: black;
  text-decoration: underline;
  text-decoration-color:#fff;
  text-decoration-thickness: 0px;
  border-bottom: 0px solid #fff;
  margin-bottom: 5px;
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
  .doleance {
    width: 90%;
  }
}

</style>
