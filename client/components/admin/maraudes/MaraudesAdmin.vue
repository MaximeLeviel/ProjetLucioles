<template>
  <div>
    <div v-for="maraude in maraudes" :key="maraude.maraude_id" class="maraude">
        <h3>{{maraude.nom}}</h3>
        <p>Date : {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} {{maraude.heure}} </p>
        <p>Participants : {{maraude.nombre_volontaires}}/{{maraude.nombre_participants}} </p>
        <p class="delete" @click="deleteMaraude(maraude)">🥨</p>
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
        const result = await axios.get('/api/maraudes')
        this.maraudes = result.data
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
.maraude{
    background-color: rgb(248, 248, 248);
    margin: 2px;
    border-radius: 10px;
}

.delete:hover{
    cursor: pointer;
}
</style>