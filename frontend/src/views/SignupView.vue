<template>
  <div>
    <Header/>
    <div class="signup">
      <h1>Inscription</h1>
      <h2>Nous sommes ravis de vous accueillir chez Groupomania.</h2>
      <p>Veuillez saisir les informations demandées </p> 
      <form>
        <ul>
          <li>
            <input type="text" v-model="nom" placeholder="Nom" size="50" required aria-label="Nom">
          </li>
          <li>
            <input type="text" v-model="prenom" placeholder="Prénom" size="50" required aria-label="Prénom">
          </li>
          <li>
            <input type="email" v-model="email" placeholder="Email" size="50" required aria-label="Email">
          </li>
          <li>
            <input type="password" v-model="password" placeholder="Mot de passe" size="50" required aria-label="Mot de passe">
          </li>
        </ul>
      </form>   
      <button @click.prevent="signup()" type="submit" aria-label="S'enregistrer" class="btnSave"><i class="fas fa-edit"></i> S'enregistrer </button>
    </div>
    <Footer/>
  </div>
</template>

<script>
import axios from 'axios'
import Header from "../components/HeaderCompo";
import Footer from "../components/FooterCompo";
export default {
name: 'SignupView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      nom: '',
      prenom: '',
      email: '',
      password: '',
    }
  },
  methods: {
    // Enregistrement d'un compte
    signup() {
      const regexText = /^[a-zA-Z-\s]{2,}$/;
      const regexEmail = /^([a-zA-Z0-9.-_]+)@((?:[a-zA-Z0-9.-_]+.)+)([a-zA-Z]{2,4})/;
      if (regexText.test(this.nom) === false) {
        alert("Votre nom doit comporter au minimum 2 lettre et ne doit pas comporter de chiffres ou de caractères spéciaux autre que -");
        return
      }
      else if (regexText.test(this.prenom) === false) {
        alert("Votre prenom doit comporter au minimum 2 lettre et ne doit pas comporter de chiffres ou de caractères spéciaux autre que -");
        return
      }
      else if (regexEmail.test(this.email) === false) {
        alert("Ce format d'email n'est pas valide")
        return
      } 

      if(
        this.password.length < 6 
        ||/[a-z]/.test(this.password) === false 
        || /[A-Z]/.test(this.password) === false 
        || /\d/.test(this.password) === false
      ){
        alert("Votre mot de passe doit contenir au minimum une majuscule, une minuscule, un chiffre et doit faire 6 caractères de long")
        return;
      }
      let data = {
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          password: this.password
      };
      {   
        axios.post("http://localhost:3000/api/auth/signup", data, {
            headers: { }
        })
        .then(() => {
              alert("Utilisateur créé");
              this.$router.push("/login");
          })
          .catch(alert)
      }
    }
  }
}
</script>

<style scoped>
.signup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

h2 {
  color: black;
}

p {
  color: black;
  font-size: 20px;
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
}

input {
  border-radius: 15px;
  text-align: center;
  margin: 10px auto;
}

button {
  background-color: #fac4cf;
}

footer {
  padding: 0;
}

/* Version desktop */
@media (min-width: 1025px) and (max-width: 1280px) {
  form{
    width: 60%;
  }
}
</style>