<template>
  <div>
        <h2>Maraude</h2>
        <hr>
        <form @submit.prevent="modifierMaraude">
            <div class="select-date">
                <select v-model="selectedYear" class="date" required>
                    <option v-for="annee in annees" :key="annee">{{annee}}</option>
                </select>
                <select v-model="selectedMonth" class="date" required>
                    <option v-for="mois in 12" :key="mois">{{mois}}</option>
                </select>
                <select v-model="selectedDay" class="date" required>
                    <option v-for="jour in jours" :key="jour">{{jour}}</option>
                </select>
                <select @change="changeTrajet()" class="date" id="trajet" required>
                    <option v-for="(trajet, index) in trajets" :key="trajet.trajet_id">{{index+1}}.{{trajet.nom_trajet}} </option>
                </select>
            </div>

            <input type="text" class="first" v-model="nom" placeholder="Nom de la maraude" required>
            <input type="text" v-model="nbParticipants" placeholder="Nombre de participants" required>
            <div class="heure">
                <input type="text" class="heure-heure" v-model="heures" placeholder="Heure" required>
                <p>h</p>
                <input type="text" class="heure-minute" v-model="minutes" placeholder="Minute" required>
            </div>

            <button type="submit">Valider</button>
        </form>
  </div>
</template>


<script>
module.exports = {
    data () {
        return {
            annees: null,
            selectedYear: null,
            selectedMonth: null,
            selectedDay: null,
            nbParticipants: null,
            trajets: null,
            trajet: null,
            heures: null,
            minutes: null,
            nom: null,
        }
    },

    computed: {
        jours: function() {
            return new Date(this.selectedYear, this.selectedMonth, 0).getDate()
        }
    },

    created: async function() {
        const actualDate = new Date()
        const annee = actualDate.getFullYear()
        this.annees = [annee, annee + 1]
        var maraudeId = this.$route.params.id

        var result = await axios.get('/api/maraude/' + maraudeId)
        
        this.selectedYear = result.data[0].annee
        this.selectedMonth = result.data[0].mois
        this.selectedDay = result.data[0].jour
        this.nbParticipants = result.data[0].nombre_participants 
        this.heures = result.data[0].heure.substring(0, 2)
        this.minutes = result.data[0].heure.substring(3, 5)
        this.nom = result.data[0].nom_maraude
        type = result.data[0].type

        result = await axios.get('/api/trajets')
        this.trajets = result.data

        for(var i = 0; i < this.trajets.length; i++){
            if(this.trajets[i].trajet_id == type){
                this.trajet = this.trajets[i]
            }
        }
    },
    
    methods: {
        changeTrajet(){
            var position = document.getElementById("trajet").selectedIndex
            this.trajet = this.trajets[position]
            console.log({trajet: this.trajet})
        },

        async modifierMaraude(){
            const maraude = {
                jour: this.selectedDay,
                mois: this.selectedMonth,
                annee: this.selectedYear,
                heure: this.heures + ':' + this.minutes,
                trajet: this.trajet.trajet_id,
                nbParticipants: this.nbParticipants,
                nom: this.nom,
                id: this.$route.params.id,
            }

            const result = await axios.put('/api/admin/maraude', maraude)
            alert(result.data.message)
        }
    }
}
</script>

<style scoped>

input {
    font-size: 20px;
}
.heure>*{
    display: inline-block;
    color: grey;
}

.heure-heure {
    width: 47%;
}

.heure-minute {
    width: 47%;
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

form {
    margin-bottom: 30px;
}

.first {
    margin-top: 20px;
}

.select-date {
    margin: auto;
}

.date {
    width: 100px;
    height: 30px;
    border: 1px solid #999;
    font-size: 18px;
    color: #1c87c9;
    background-color: #eee;
    border-radius: 5px;
    box-shadow: 4px 4px #ccc;
}
</style>
