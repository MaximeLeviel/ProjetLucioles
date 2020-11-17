<template>
  <div>
        <h2>Nouvelle Maraude</h2>
        <hr>
        <form @submit.prevent="creerMaraude">
            <div class="select-date">
                <select v-model="selectedYear" class="date">
                    <option v-for="annee in annees" :key="annee">{{annee}}</option>
                </select>
                <select v-model="selectedMonth" class="date">
                    <option v-for="mois in 12" :key="mois">{{mois}}</option>
                </select>
                <select v-model="selectedDay" class="date">
                    <option v-for="jour in jours" :key="jour">{{jour}}</option>
                </select>
                <select @change="changeTrajet(trajet)">
                    <option v-for="(trajet, index) in trajets" :key="trajet.trajet_id">{{index+1}}.{{trajet.nom}} </option>
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

        <router-view></router-view>
  </div>
</template>


<script>
module.exports = {
    data () {
        return {
            annees: null,
            selectedYear: '',
            selectedMonth: '',
            selectedDay: '',
            nbParticipants: '',
            trajets: null,
            trajet: null,
            heures: '19',
            minutes: "00",
            nom: ''
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
        const result = await axios.get('/api/trajets')
        this.trajets = result.data
        this.trajet = this.trajets[0]
        this.nom = this.trajet.nom
        console.log(this.trajet)
    },
    
    methods: {
        changeTrajet(trajet){
            this.trajet = trajet.trajet_id
            this.nom = this.trajet.nom
        },
        async creerMaraude(){
            const maraude = {
                jour: this.selectedDay,
                mois: this.selectedMonth,
                annee: this.selectedYear,
                heure: this.heures + ':' + this.minutes,
                trajet: this.trajet.trajet_id,
                nbParticipants: this.nbParticipants,
                nom: this.nom,
            }

            await axios.post('/api/admin/maraude', maraude)
        }
    }
}
</script>

<style scoped>

.select-date {
    width: 75%;
    margin: auto;
}

select {
    width: 22%;
}

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

</style>
