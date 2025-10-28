<template>
  <div>
    <Header/>
    <div class="login">
      <h1>Connexion</h1>
      <p>Veuillez saisir votre email et votre mot de passe</p>
      <form>
        <ul>
          <li>
            <input type="email" v-model="email" placeholder="Adresse email" required aria-label="Email de connexion">
          </li>
          <li>
            <input type="password" v-model="password" placeholder="Mot de passe" required aria-label="Mot de passe">
          </li>
        </ul>  
      </form>
      <div class="alert alert-danger" v-if="loginFailure">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Email ou mot de passe incorrect
      </div>
      <button @click.prevent="login()" type="submit" aria-label="Se connecter" class="btnSave">Valider</button>
    </div>
    <Footer/>
  </div>
</template>

<script>
import axios from 'axios'
import Header from "../components/HeaderCompo";
import Footer from "../components/FooterCompo";
export default {
  name: 'LoginView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      email: '',
      password: '',
      loginFailure: false
    }
  },
  methods: {
      login() {
      axios.post("http://localhost:3000/api/auth/login", {
        email: this.email,
        password: this.password
      })
      .then((res) => {
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('token', res.data.token);
        this.$router.push('/allposts')
        console.log("Utilisateur connecté");
      })
      .catch((err) => {
          console.log("erreur vuejs : " + err);
          this.loginFailure = true;
      })      
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

p {
  color: black;
  font-size: 20px;
}

form{
  width: 50%;
}

ul {
list-style: none;
padding: 0;
}

li {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 30px;
}

input {
  border-radius: 15px;
  font-size: 20px;
  text-align: center;
}

button {
  background-color: #fac4cf;
}

.alert{
  color:red;
  font-weight: bolder;
}

/* DESKTOP*/
@media screen and (min-width: 950px) {
  form{
    width: 30%;
  }
  h1{
    width: 25%;
  }
}
</style>