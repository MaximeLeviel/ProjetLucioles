<template>
  <div>
        <nav>
          <button class="btn-top"><router-link to='/admin/maraudes/maraudes'>Maraudes</router-link></button>
          <button class="btn-top"><router-link to='/admin/maraudes/new'>Nouvelle maraude</router-link></button>
          <button class="btn-top"><router-link to='/admin/maraudes/trajets'>Trajets</router-link></button>
          <button class="btn-top"><router-link to='/admin/maraudes/trajet/new'>Nouveau trajet</router-link></button>
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
</style>
