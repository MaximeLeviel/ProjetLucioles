<template>
  <div>
      <h2>Liste des utilisateurs</h2>
      <hr>
    <div v-for="user in users" :key="user.id" class="user">
        <h3>{{user.prenom}} {{user.nom}} </h3>
        <p><span>Numéro de téléphone :</span> {{user.telephone}} </p>
        <p><span>Email :</span> {{user.email}}</p>
        <p><span>Nombre de participations :</span> {{user.nombre_participations}}</p>
        <p><span>Participations :</span></p>
        <ul>
            <li v-for="(maraude, index) in userMaraude(user)" :key="index">
                <p v-if="maraude != null">{{maraude.nom_maraude}} du {{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}}</p> 
                <p v-else>Maraude suprimée.</p>
            </li>
        </ul>
        <p class="delete" @click="deleteUser(user)">Supprimer l'utilisateur</p>
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
        console.log({message: this.users})
    },

    methods: {
        async deleteUser(user){
            var result = await axios.delete('/api/admin/user/' + user.id)
            result = await axios.get('/api/admin/users')
            this.users = result.data
        },

        userMaraude(user){
            console.log({message : user.maraudes})
            return user.maraudes
        }
    }
}
</script>

<style scoped>
.user{
    background-color: rgb(248, 248, 248);
    border-radius: 10px;
    width: 480px;
    margin: auto;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.user h3 {
    text-align: center;
}

.user p {
    margin-top: 5px;
    margin-bottom: 5px;
}

.user p span {
    text-decoration: underline;
}

.delete {
    text-align: center;
    color: grey;
}

.delete:hover{
    cursor: pointer;
    text-decoration: underline;
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

ul {
    margin-left: 20px;
}
</style>