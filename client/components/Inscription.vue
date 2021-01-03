<template>
  <div v-if="maraude!=null" class="main">
    <h2>{{maraude.nom_maraude}}</h2>
    <hr>

    <div class="limiter">
      <div class="container-table">
        <div class="wrap-table">
          <div class="table">

            <div class="row header">
              <div class="cell">
                Date
              </div>
              <div class="cell">
                Heure
              </div>
              <div class="cell">
                Lieu de départ
              </div>
              <div class="cell">
                Lieu d'arrivée
              </div>
              <div class="cell">
                Nombre de places restantes
              </div>
            </div>

            <div class="row">
              <div class="cell" data-title="Date">
                <p>{{maraude.jour}}/{{maraude.mois}}/{{maraude.annee}}</p>
              </div>
              <div class="cell" data-title="Heure">
                <p>{{maraude.heure}}</p>
              </div>
              <div class="cell" data-title="Lieu de départ">
                <p>{{maraude.depart}}</p>
              </div>
              <div class="cell" data-title="Lieu d'arrivée">
                <p>{{maraude.arrivee}}</p>
              </div>
              <div class="cell" data-title="Places restantes">
                <p>{{placesRestantes(maraude.nombre_volontaires, maraude.nombre_participants)}}/{{maraude.nombre_participants}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    


    <div v-if="doleances != null"> 
      <h2 style="margin-top: 30px;">Doléances associées</h2>
      <hr>
    
      <div class="limiter">
        <div class="container-table">
          <div class="wrap-table">
            <table class="table">
              <tr class="row header">
                <th class="cell">Titre</th>
                <th class="cell">Description</th> 
                <th class="cell">Lieu</th>
                <th class="cell">Je peux amener...</th>
              </tr>

              <tr v-for="doleance in doleances" :key="doleance.id" class="row">
                <td class="cell">{{doleance.objet}}</td>
                <td class="cell">{{doleance.description}}</td>
                <td class="cell">{{doleance.lieu}}</td>
                <td class="cell"><input type="checkbox" class="checkbox" v-model="doleance.checked"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <form @submit.prevent="verifierEmail" v-if="isUserConnu">
        <h3>Entrez votre email pour vous inscrire</h3>
        <input type="text" v-model="email" placeholder="Adresse mail" required>

        <button type="submit">S'inscrire</button>
    </form>
    <form @submit.prevent="inscrireUser" v-else>
        <h3>Entrez vos informations complémentaires</h3>
        <input type="text" v-model="email" placeholder="Entrez votre email" disabled="disabled" required>
        <input type="text" v-model="nom" placeholder="Entrez votre nom" required>
        <input type="text" v-model="prenom" placeholder="Entrez votre prénom" required>
        <input type="text" v-model="phone" placeholder="Entrez votre numéro de téléphone" required>

        <button type="submit">S'incrire</button>
    </form>

  </div>
</template>

<script>

module.exports = {
  data () {
    return {
        maraude: null,
        isUserConnu: true,
        email: '',
        nom: '',
        prenom: '',
        phone: '',
        doleances: null
    }
  },

  created: async function() {
    const maraudeId = this.$route.params.id
    const result1 = await axios.get('/api/maraude/' + maraudeId)
    this.maraude = result1.data[0]
    const result2 = await axios.get('/api/doleance/trajet/' + this.maraude.trajet_id)
    if(result2.data !== null){
      for(let i = 0; i < result2.data.length; i++){
        result2.data[i].checked = false
      }
    }
    this.doleances = result2.data
    console.log({doleances: this.doleances})
  },

  methods: {
    placesRestantes(placesPrises, placesTotales){
        return placesTotales - placesPrises
    },

    async verifierEmail(){
      const inscription = {
        email: this.email,
        id: this.maraude.maraude_id,
        objets: this.selectedDoleances(),
      }
      const result = await axios.post('/api/email', inscription)
      if (result.data.connu === false){
        this.isUserConnu = false
      }
      else{
        alert(result.data.message)
      }
    },

    async inscrireUser() {
      const inscription = {
        email: this.email,
        nom: this.nom,
        prenom: this.prenom,
        phone: this.phone,
        id: this.maraude.maraude_id,
        objets: this.selectedDoleances(),
      }
      const result = await axios.post('/api/participant', inscription)
      alert(result.data.message)
    },

    selectedDoleances(){
      const data = [];
      if(this.doleances !== null){
        for(let i = 0; i < this.doleances.length; i++){
          if(this.doleances[i].checked === true){
            data.push(this.doleances[i].id)
          }
        }
      }
      return data
    },
  }
}
</script>

<style scoped>

.main {
  padding-top: 30px;
  padding-bottom: 20px;
}

h2 {
  font-family: 'open sans', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica-Neue', Helvetica, Arial, sans-serif;
  font-size: 28px;
  line-height: 1.1em;
  margin-bottom: 30px;
  display: block;
  font-size: 1.5em;
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


.limiter {
  width: 100%;
  margin: 0 auto;
}

.container-table {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 33px 30px;
}

.wrap-table {
  width: 960px;
  border-radius: 10px;
  overflow: hidden;
}

.table {
  width: 100%;
  display: table;
  margin: 0;
}

@media screen and (max-width: 768px) {
  .table {
    display: block;
  }
}

.row {
  display: table-row;
  background: #fff;
}

.row.header {
  color: #ffffff;
  background: #006ba1;
}

table, th, td {
  border: 0px solid;
  border-collapse: collapse;
}

@media screen and (max-width: 768px) {
  .row {
    display: block;
  }

  .row.header {
    padding: 0;
    height: 0px;
  }

  .row.header .cell {
    display: none;
  }

  .row .cell:before {
    font-family: Poppins-Bold;
    font-size: 12px;
    color: #808080;
    line-height: 1.2;
    text-transform: uppercase;
    font-weight: unset !important;

    margin-bottom: 13px;
    content: attr(data-title);
    min-width: 98px;
    display: block;
  }
}

.cell {
  display: table-cell;
}

@media screen and (max-width: 768px) {
  .cell {
    display: block;
  }
}

.row .cell {
  font-family: Poppins-Regular;
  font-size: 15px;
  color: #666666;
  line-height: 1.2;
  font-weight: unset !important;

  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f2f2f2;
}

.row.header .cell {
  font-family: Poppins-Regular;
  font-size: 18px;
  color: #fff;
  line-height: 1.2;
  font-weight: unset !important;

  padding-top: 19px;
  padding-bottom: 19px;
}

.row .cell:nth-child(1) {
  padding-left: 40px;
}

.table, .row {
  width: 100% !important;
}


@media (max-width: 768px) {
  .row {
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 18px;
    padding-top: 30px;
    padding-right: 15px;
    margin: 0;
  }
  
  .row .cell {
    border: none;
    padding-left: 30px;
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .row .cell:nth-child(1) {
    padding-left: 30px;
  }
  
  .row .cell {
    font-family: Poppins-Regular;
    font-size: 18px;
    color: #555555;
    line-height: 1.2;
    font-weight: unset !important;
  }

  .table, .row, .cell {
    width: 100% !important;
  }
}
</style>