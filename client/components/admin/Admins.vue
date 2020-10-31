<template>
  <div>
      <div> 
        <h2>Ajouter un administrateur</h2>
        <form @submit.prevent="ajouterAdmin">
            <input type="text" v-model="email" placeholder="Entrez votre adresse mail" required>
            <input type="text" v-model="password" placeholder="Entrez votre mot de passe" required>

            <button type="submit">Ajouter</button>
        </form>
      </div>
        <div v-for="administrateur in administrateurs" :key="administrateur.id" class="admin">
            <p>{{administrateur.id}}</p>
            <p>{{administrateur.email}}</p>
            <p v-if="administrateur.id !== currentAdmin" class="cross" @click="deleteAdmin(administrateur)">🥨</p>
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
.admin{
    border: solid 1px black;
    margin: 5px
}

.admin>p{
    display: inline-block;
}

.cross:hover{
    cursor: pointer;
}
</style>