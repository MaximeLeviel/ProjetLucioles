<template>
  <div>
    <div class="presentation-lucioles">
      <div class="container">
        <div class="flex_column">
          <h1>Présentation des Lucioles</h1>
          <hr class="prez-lucioles">
          <p>Lors de nos balades, nos essaims de lucioles visitent les personnes SDF dans une tournée de rue sous forme de « visite à domicile ».
          Equipées de thermos, de vêtements, de denrées et surtout d’entrain, les lucioles apportent un peu de chaleur dans les cœurs et de la lumière dans l’obscurité.</p>

          <p>Communiquer, partager, écouter, s’intéresser autour d’une boisson chaude, sont les valeurs d’une bonne balade des lucioles.</p>
        
          <p>Les balades de rue sont un moyen de lutter contre la solitude des personnes SDF, qui souffrent de leur exclusion.
            Les lucioles deviennent le lien qui les raccroche encore à la société.</p>

          <p>Venez-nous rejoindre lors de nos balades ! Suivez-nous sur nos réseaux sociaux pour vous tenir informé de tous les événements !</p>

          <a href="https://labaladedeslucioles.org/" target=_blank><button class="info-lucioles">Plus d'informations</button></a>
        </div>
      </div>
    </div>

    <div class="presentation-equipe">
      <div class="container">
        <div class="flex_column">
          <h1>Présentation de l'équipe</h1>
          <hr>
          <p>Nous sommes quatre étudiants en 1ère année du cycle ingénieur d'EFREI Paris : Romy, Lisa, Maxime et Chloé. Nous avons pris contact avec La Balade des Lucioles en Septembre 2020 afin de leur proposer notre aide.</p>
          <p>Ainsi, nous avons pu mettre en place ce site afin d'aider l'organisation et la mise en place des maraudes. Ce site a été réalisé au sein d'un projet pour nos études : "Le numérique au service de la société".</p>
          <p>Nous espérons répondre à ce thème via ce travail afin d'aider, à notre manière, les personnes SDF et les personnes qui les aident au sein de La Balade des Lucioles.</p>
        </div>
      </div>
    </div>

  </div>
</template> 

<script>
module.exports = {
  data () {
    return {
        test: null,
    }
  },
  methods: {
  }
}
</script>

<style scoped>
/* --- presentation lucioles --- */
.presentation-lucioles {
  width: 100%;
  background-color:#fff;
}

.container {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 0px 50px;
  clear: both;
}

div .flex_column {
  z-index: 1;
  float: left;
  position: relative;
  min-height: 1px;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 50px;
}

.flex_column p {
  display: block;
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 30px;
  text-align: justify;
}

h1 {
  font-family: 'open sans', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica-Neue', Helvetica, Arial, sans-serif;
  font-size: 28px;
  line-height: 1.1em;
  margin-top: 20px;
  margin-bottom: 30px;
  display: block;
  font-size: 1.5em;
  text-align: center;
  text-transform: uppercase;
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

.info-lucioles {
  width: 30%;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 0;
  font-family: 'open sans', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica-Neue', Helvetica, Arial, sans-serif;
}

/* --- presentation de l'equipe --- */
/* Three columns side by side */
.presentation-equipe {
  background-color: #e5e5e5;
  padding: 10px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.column {
  flex: 1;
  display: inline-block;
  width: 33.3%;
  margin-bottom: 16px;
  padding: 0 8px;
  flex-wrap: wrap;
}

/* Display the columns below each other instead of side by side on small screens */
@media screen and (max-width: 650px) {
  .column {
    width: 100%;
    display: block;
  }
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 25px;
  margin-top: 15px;
}

img {
  width: 100%;
}

h2 {
  text-align: center;
  color: #007cba;
}

.title {
  text-align: center;
}

.container {
  padding: 0 16px;
}

.container::after, .row::after {
  content: "";
  clear: both;
  display: table;
}

.title {
  color: grey;
}

a {
  text-decoration: none;
}

button {
  margin-bottom: 10px;
  margin-top: 10px;
  font-family: 'open sans', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica-Neue', Helvetica, Arial, sans-serif;
  letter-spacing: 3px;
}

.polaroids {
  text-align: center;
}

.polaroids .a {
  background: white;
  display: inline-block;
  text-decoration: none;
  font-size: 24px;
  padding: 10px 10px 25px 10px;
  width: 300px;
  color: #8B8B8B;

  -moz-box-shadow: 0px 1px 5px 0px #656565;
  -webkit-box-shadow: 0px 1px 5px 0px #656565;
  -o-box-shadow: 0px 1px 5px 0px #656565;
  box-shadow: 0px 1px 5px 0px #656565;
}


.polaroids .a:after {
  content: attr(title);
}

.polaroids img {
  border: 1px solid #C9C9C9;
}

@media only screen and (max-width: 900px) {
  .row {
    flex-direction: column;
    margin: auto;
  }

  .column {
    margin-left: 15%;
  }

  .info-lucioles {
    font-size: 10px;
  }
}

</style>