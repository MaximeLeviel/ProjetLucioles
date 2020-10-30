<template>
  <div>
    <li>
      <el v-for="event in events" :key="event" @click="selectMaraude(event)">
        <router-link to='/test'>
        <p>{{event.titre}}</p>
        <p>Date: {{event.date}}</p>
        <p>Lieu: {{event.lieu}}</p>
        <p>Nombre de places encore disponibles: {{event.nombre}}</p>
      </el>
    </li>
    
    <button><router-link to='/inscription'>Valider</router-link></button>
  </div>
</template>


<script>
module.exports = {
  props: {
    
  },
  data () {
    return {
      newArticle: {
        name: '',
        description: '',
        image: '',
        price: 0
      },

      editingArticle: {
        id: -1,
        name: '',
        description: '',
        image: '',
        price: 0
      }
    }
  },

  methods: {
    selectMaraude(event){
      this.$emit('selection-maraude', event)
    },
  }
}
</script>

<style scoped>
article {
  display: flex;
}

.article-img {
  flex: 1;
}

.article-img div {

  max-height: 100%;
  width: auto;
  background-size: cover;
  border-style: solid;
  border-width: 2px;
}

.article-content {
  flex: 3;
}

.article-title {
  display: flex;
  justify-content: space-between;
}

textarea {
  width: 100%;
}
</style>
