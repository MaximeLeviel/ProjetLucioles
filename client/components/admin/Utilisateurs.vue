<template>
  <div>
    <div v-for="user in users" :key="user.id" class="user">
        <h3>{{user.nom}} {{user.prenom}} </h3>
        <p>Numéro de téléphone: {{user.telephone}} </p>
        <p>Email : {{user.email}}</p>
        <p>Nombre de participations: {{user.nombre_participations}}</p>
        <p>Participations:</p>
        <ul>
            <li v-for="(maraude, index) in user.maraudes" :key="index">{{maraude.nom}} du {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}} </li>
        </ul>
        <p class="delete" @click="deleteUser(user)">🥨</p>
    </div>
  </div>
</template>


<script>
module.exports = {
    data () {
        return {
            users: null
        }
    },

    created: async function(){
        const result = await axios.get('/api/admin/users')
        this.users = result.data
    },

    methods: {
        async deleteUser(user){
            var result = await axios.delete('/api/admin/user/' + user.id)
            result = await axios.get('/api/admin/users')
            this.users = result.data
        },
    }
}
</script>

<style scoped>
.user{
    background-color: rgb(248, 248, 248);
    margin: 2px;
    border-radius: 10px;
}

.delete:hover{
    cursor: pointer;
}
</style>