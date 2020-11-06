<template>
  <div>
    <button class="btn-top"><router-link to='/admin/maraudes/maraudes/new'>Nouvelle maraude</router-link></button>
    <div v-for="maraude in maraudes" :key="maraude.id" class="maraude">
        <h3>{{maraude.nom}}</h3>
        <p>Date : {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} {{maraude.heure}} </p>
        <p>Participants : {{maraude.nombre_volontaires}}/{{maraude.nombre_participants}} </p>
    </div>
    <router-view></router-view>
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
}
</script>

<style scoped>
.maraude{
    background-color: rgb(248, 248, 248);
    margin: 2px;
    border-radius: 10px;
}
</style>