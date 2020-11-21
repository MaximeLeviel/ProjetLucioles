<template>
  <div>
        <div> 
            <h2>Ajouter un administrateur</h2>
            <hr>
            <form @submit.prevent="ajouterAdmin">
                <input type="text" v-model="email" placeholder="Entrez l'adresse mail" required>
                <input type="text" v-model="password" placeholder="Entrez le mot de passe" required>

                <button type="submit">Ajouter</button>
            </form>
        </div>

        <div>
            <h2>Liste des administrateurs</h2>
            <hr>
            <div v-for="administrateur in administrateurs" :key="administrateur.id" class="admin">
                <p id="email">{{administrateur.email}}</p>
                <p v-if="administrateur.id !== currentAdmin" class="cross" @click="deleteAdmin(administrateur)">Supprimer l'administrateur</p>
            </div>
        </div>
  </div>
</template>


<script>
module.exports = {
    data () {
        return {
            administrateurs: null,
            currentAdmin: null,
            email: '',
            password: '',
        }
    },

    created: async function(){
        console.log('test1')
        const result = await axios.get('/api/admin/admins')
        this.administrateurs = result.data.administrateurs
        this.currentAdmin = result.data.currentId
        console.log('test2')
        console.log(this.administrateurs)
        console.log(result.data.currentId)
        console.log(result)
    },

    methods: {
        async deleteAdmin(administrateur){
            const result = await axios.delete('/api/admin/' + administrateur.id)
            this.administrateurs = result.data
        },
        async ajouterAdmin(){
            if(this.email !== '' && this.password !== ''){
                const admin = {
                    email: this.email,
                    password: this.password,
                }

                const result = await axios.post('/api/admin/register', admin)
                this.administrateurs = result.data
            }
        }
    }
}
</script>

<style scoped>
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
    margin-bottom: 15px;
}

.admin {
    border: solid 2px black;
    border-radius: 10px;
    width: 30%;
    background-color: #fff;
    margin: auto;
    text-align: center;
    margin-top: 20px;
    padding: 20px;
}

.admin:last-child {
    margin-bottom: 20px;
}

.admin p #id {
    text-decoration: bold;
}

.cross {
    color: grey;
}

.cross:hover{
    cursor: pointer;
    text-decoration: underline;
}

.id {
    text-decoration: bold;
}
</style>