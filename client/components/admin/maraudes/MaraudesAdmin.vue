<template>
  <div>
      <h2>Maraudes</h2>
      <hr>

    <div v-for="maraude in maraudes" :key="maraude.maraude_id" class="maraude">
        <h3><span>{{maraude.nom_maraude}}</span></h3>
        <p>Date : {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} {{maraude.heure}} </p>
        <p>Participants : {{maraude.nombre_volontaires}}/{{maraude.nombre_participants}} </p>
        <ul>
            <li v-for="participant in maraude.participants" :key="participant.id" >{{participant.nom}} {{participant.prenom}}<br>Contact: {{participant.email}}, {{participant.telephone}} </li>
        </ul>
        <p class="delete" @click="deleteMaraude(maraude)">Supprimer cette maraude</p>
    </div>
  </div>
</template>


<script>


module.exports = {
    data () {
        return {
            maraudes: null
        }
    },

    created: async function(){
        console.log("Test1")
        const result = await axios.get('/api/admin/maraudesUtilisateurs')
        console.log("Test2")
        this.maraudes = result.data
        console.log({maraudes: result.data})
    },

    methods: {
        async deleteMaraude(maraude){
            var result = await axios.delete('/api/admin/maraude/' + maraude.maraude_id)
            result = await axios.get('/api/maraudes')
            this.maraudes = result.data
        },
    }
}
</script>

<style scoped>
.maraude {
    width: 40%;
    background-color: rgb(248, 248, 248);
    border-radius: 10px;
    margin: auto;
    margin-top: 20px;
    padding: 20px;
}

.maraude:last-child {
    margin-bottom: 30px;
}

.delete {
    text-align: center;
    color: grey;
    margin-top: 20px;
}

.delete:hover{
    cursor: pointer;
    text-decoration: underline;
    transition: all 0.4s;
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