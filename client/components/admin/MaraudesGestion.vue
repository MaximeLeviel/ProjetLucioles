<template>
  <div>
        <nav class="navbar-maraudes">
          <a><router-link to='/admin/maraudes/maraudes'>Maraudes</router-link></a>
          <a><router-link to='/admin/maraudes/new'>Nouvelle maraude</router-link></a>
          <a><router-link to='/admin/maraudes/trajets'>Trajets</router-link></a>
          <a><router-link to='/admin/maraudes/trajet/new'>Nouveau trajet</router-link></a>
        </nav>
        <router-view></router-view>
  </div>
</template>


<script>
module.exports = {
  data (){
    return{
      test: null
    }
  }
}
</script>

<style scoped>
nav {
  margin-top: 10px;
}

.navbar-maraudes {
  background-color: #2c353d;
  width: 100%;
  height: 50px;
  bottom: 0;
  text-align: center;
  padding-top: 10px;
}

.navbar-maraudes a {
  color:lightgrey;
  margin: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
}

.navbar-maraudes a:hover {
  color: #fff;
}
</style>
