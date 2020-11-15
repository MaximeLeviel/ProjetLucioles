<template>
  <div>
        <h2>Nouveau trajet</h2>
        <form @submit.prevent="creerTrajet">
            <input type="text" v-model="nom" placeholder="Nom du trajet" required>
            <div v-for="(etape, index) in etapes" :key=index class="etape">
                <input type="text" v-model="etapes[index]" :placeholder="'Etape ' + index" required>
                <p v-if="index > 0" class="delete" @click="deleteEtape(index)">🥨</p>
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

.etape>*{
    display: inline-block;
}
</style>