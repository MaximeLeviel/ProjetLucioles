<template>
  <div>
    <button class="btn-top"><router-link to='/admin/trajet/new'>Nouveau trajet</router-link></button>
    <div v-for="trajet in trajets" :key="trajet.id" class="trajet">
        <h3>{{trajet.nom}}</h3>
        <p>Départ : {{trajet.depart}}</p>
        <p>Arrivée : {{trajet.arrivee}}</p>
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
    },
}
</script>

<style scoped>
.trajet{
    background-color: rgb(248, 248, 248);
    margin: 2px;
    border-radius: 10px;
}
</style>