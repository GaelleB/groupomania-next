<template>
  <header class="nav">
    <img class="imgLogo" src="/icon-left-font.png" alt="Logo Groupomania" />
    <nav>
      <router-link class="link" to="/profile"  aria-label="Profil">Mon profil</router-link>
      <router-link class="link" to="/allposts" aria-label="Retour vers Le fil d'actu de Groupomania"><i class="fas fa-home home"></i></router-link>
      <router-link class="link" to="/" @click="disconnectUser()">Déconnexion</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderProfile',
  data () {
    return {
      role:''
    }
  },
  methods: {
    disconnectUser() {
      localStorage.clear();
      this.$router.push("/")
      console.log("Utilisateur déconnecté");
    },
    roleUser() {
      this.role = JSON.parse(localStorage.getItem("role"))
    }
  },
  mounted(){
    this.roleUser()
  }
}   
</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.imgLogo {
  width: 60%;
  padding-top: 10px;
  margin-left: auto;
  margin-right: auto;
  object-fit: cover;
  background-size: cover;
}

.link {
  padding-left: 30px;
  font-size: 1.1rem;
  text-decoration: none;
  cursor: pointer;
}

.link:hover {
  color: black;
}

.nav {
  padding: 20px 90px;
  font-size: 20px;
}

.nav a {
  font-weight: bold;
  color: #000000;
}

.nav a.router-link-exact-active {
  color: black;
}

i {
  font-size: 1.5rem;
}

.fa-home {
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 100%;
  background: grey;
  cursor: pointer; 
  text-align: center;
  color: white;   
  display: flex;
  justify-content: center; 
  margin: auto;
  align-items: center;
}
</style>