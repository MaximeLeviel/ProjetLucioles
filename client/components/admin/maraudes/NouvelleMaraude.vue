<template>
  <div>
        <h2>Nouvelle Maraude</h2>
        <form @submit.prevent="creerMaraude">
            <select v-model="selectedYear">
                <option v-for="annee in annees" :key="annee">{{annee}}</option>
            </select>
            <select v-model="selectedMonth">
                <option v-for="mois in 12" :key="mois">{{mois}}</option>
            </select>
            <select v-model="selectedDay">
                <option v-for="jour in jours" :key="jour">{{jour}}</option>
            </select>
            <select @change="changeTrajet(trajet)">
                <option v-for="(trajet, index) in trajets" :key="trajet.id">{{index+1}}.{{trajet.nom}} </option>
            </select>
            <input type="text" v-model="nom" placeholder="Nom de la maraude" required>
            <input type="text" v-model="nbParticipants" placeholder="Nombre de participants" required>
            <div class="heure">
                <input type="text" v-model="heures" required>
                <p>h</p>
                <input type="text" v-model="minutes" required>
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
            password: '',
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
            this.trajet = trajet.id
            this.nom = this.trajet.nom
        },
        async creerMaraude(){
            const maraude = {
                jour: this.selectedDay,
                mois: this.selectedMonth,
                annee: this.selectedYear,
                heure: this.heures + ':' + this.minutes,
                trajet: this.trajet.id,
                nbParticipants: this.nbParticipants,
                nom: this.nom,
            }

            await axios.post('/api/admin/maraude', maraude)
        }
    }
}
</script>

<style scoped>
.heure>*{
    display: inline-block;
    max-width: 20px;
}
</style>
