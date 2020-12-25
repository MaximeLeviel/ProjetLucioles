<template>
  <div>
      <div class="container">
        <div class="column-1">
            <h2>Ajouter une doléance</h2>
            <hr>
            <div>
                <form @submit.prevent="creerDoleance">
                    <input type="text" v-model="objet" placeholder="Titre" required>
                    <input type="text" v-model="description" placeholder="Decrivez le besoin et la personne " required>
                    <input type="text" v-model="lieu" placeholder="Lieu">

                <select @change="changeTrajet()" class="date" id="trajet" required>
                    <option :value="null">Trajet associé</option>
                    <option v-for="(trajet, index) in trajets" :key="trajet.trajet_id">{{index+1}}.{{trajet.nom_trajet}} </option>
                </select>

                    <button type="submit">Ajouter</button>
                </form>
            </div>
        </div>
        <div class="column-2">
            <h2>Liste des doléances</h2>
            <hr>
            <div v-for="doleance in doleances" :key="doleance.id" class="doleance">
                <h3>{{doleance.objet}} </h3>
                <p><span>Description :</span> {{doleance.description}} </p>
                <p><span>Trajet associé :</span>
                <p v-if="doleance.nom_trajet != null">{{doleance.nom_trajet}}</p>
                <p v-else>Hors des trajets classiques</p>
                <p class="delete" @click="deleteDoleance(doleance)">Supprimer la doléance</p>
            </div>
        </div>
    </div>
      
  </div>
</template>


<script>
module.exports = {
    data () {
        return {
            doleances: null,
            objet: null,
            description: null,
            lieu: null,
            trajets: null,
            trajet: null,
        }
    },

    created: async function(){
        const result1 = await axios.get('/api/doleances')
        this.doleances = result1.data
        console.log({result1: result1})
        const result2 = await axios.get('/api/trajets')
        this.trajets = result2.data
    },

    methods: {
        async deleteDoleance(doleance){
            console.log({id: doleance.id})
            await axios.delete('/api/admin/doleance/' + doleance.id)
            const result = await axios.get('/api/doleances')
            this.doleances = result.data
        },

        changeTrajet(){
            var position = document.getElementById("trajet").selectedIndex
            this.trajet = this.trajets[position-1]
            this.nom = this.trajet.nom_trajet
            console.log({Trajet: this.trajet})
        },

        async creerDoleance(){
            const doleance = {
            objet: this.objet,
            description: this.description,
            lieu: this.lieu,
            trajet: this.trajet.trajet_id
            }

            const result1 = await axios.post('/api/admin/doleance', doleance)
            alert(result1.data.message)
            const result2 = await axios.get('/api/doleances')
            this.doleances = result2.data
            console.log({result2: result2})
        },
    }
}
</script>

<style scoped>

    :root {
    box-sizing: border-box;
    }

    .container {
    display: flex;
    width: 100%;
    }

    .column-1 {
    flex-shrink: 0;
    flex-basis: 50%; 
    }

    .column-2 {
        margin: auto;
        margin-top: 0;
    }


    @media only screen and (max-width: 900px) {
        .container {
            flex-direction: column;
        }
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

    .doleance{
        background-color: rgb(248, 248, 248);
        border-radius: 10px;
        width: 480px;
        margin: auto;
        padding: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .doleance h3 {
        text-align: center;
    }

    .doleance p {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .doleance p span {
        text-decoration: underline;
    }

    select {
        font-family: Poppins-Medium;
        font-size: 15px;
        line-height: 1.5;
        color: #666;
        display: block;
        width: 100%;
        background: #e6e6e6;
        height: 50px;
        border-radius: 25px;
        padding: 0 30px 0 68px;
        border: none;
        margin-bottom: 15px;
    }

    .delete{
        text-align: center;
    }
    
    .delete:hover{
        cursor: pointer;
        text-decoration: underline;
    }
</style>