<template>
  <div>
        <h2>Nouveau trajet</h2>
        <hr>
        <form @submit.prevent="creerTrajet">
            <input type="text" v-model="nom" placeholder="Nom du trajet" required>
            <div v-for="(etape, index) in etapes" :key=index class="etape">
                <input type="text" v-model="etapes[index]" :placeholder="'Etape ' + index" required>
                <p v-if="index > 0" class="delete" @click="deleteEtape(index)">X</p>
            </div>
            <button type="button" @click="ajouterEtape">➕ Ajouter une étape</button>

            <button type="submit">Valider</button>
        </form>

        <router-view></router-view>
  </div>
</template>


<script>
module.exports = {
    data () {
        return {
            nom: '',
            depart: '',
            arrivee: '',
            etapes: [''],
        }
    },

    computed: {
        jours: function() {
            return new Date(this.selectedYear, this.selectedMonth, 0).getDate()
        }
    },
    
    methods: {
        deleteEtape(index){
            this.etapes.splice(index, 1)
        },
        ajouterEtape(){
            this.etapes.push('')
        },

        async creerTrajet(){
            if(this.etapes.length > 1){
                const trajet = {
                    nom: this.nom,
                    depart: this.etapes[0],
                    arrivee: this.etapes[this.etapes.length -1],
                    trajet: this.etapes,
                }

                await axios.post('/api/admin/trajet', trajet)
            }
            else{
                alert("Il faut au moins 2 étapes.")
            }
        }
    }
}
</script>

<style scoped>
.delete:hover{
    cursor: pointer;
}

input {
    width: 100%;
    font-size: 20px;
}

.etape {
    display: inline-block;
    margin: auto;
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

button {
    margin-top: 20px;
}

form {
    margin-bottom: 30px;
}
</style>