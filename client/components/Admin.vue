<template>
  <div>
    <div v-if="!isUserConnected"> 
        <h2>Log in</h2>
        <form @submit.prevent="loginUser">
            <h3>Log into your account</h3>
            <input type="text" v-model="email" placeholder="Enter your email adress" required>
            <input type="text" v-model="password" placeholder="Enter your password" required>

            <button type="submit">Log in</button>
        </form>
    </div>
    <div v-else>
        <nav>
            <button class="btn-top" @click="changeComponent('Maraudes')">Maraudes</button>
            <button class="btn-top" @click="changeComponent('Doleance')">Doléances</button>
            <button class="btn-top" @click="changeComponent('Utilisateurs')">Utilisateurs</button>
            <button class="btn-top" @click="changeComponent('Amdins')">Admins</button>
        </nav>
        <component :is="dynamicComponent"></component>
    </div>
  </div>
</template>


<script>
module.exports = {
    data () {
        return {
            email: '',
            password: '',
            isUserConnected: false,
            dynamicComponent: "/admin/Maraudes.vue"
        }
    },

    created: async function () {
        const result = await axios.get('/api/admin/me')
        this.isUserConnected = result.data.admin
        console.log(result.data.admin)
    },

    methods: {
        async loginUser(){
            if(this.email !== '' && this.password !== ''){
                const user = {
                    email: this.email,
                    password: this.password,
                }

                const result = await axios.post('/api/admin/login', user)

                this.isUserConnected = result.data.connected
            }
        },

        changeComponent(componentName){
            this.dynamicComponent = componentName
        }
    }
}
</script>

<style scoped>
</style>
