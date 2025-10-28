<template>
    <div>
        <HeaderProfile/>
            <section>
                <h1>Modification de votre post</h1>
                <p>Vous pouvez modifier le contenu du post</p>
                <form>
                    <ul>
                        <li>
                            <label for="titre" aria-label="Titre">Titre</label>
                            <input class="title" type="text" v-model="post.title" required aria-label="Titre" disabled size="50" >
                        </li>
                        <li>
                            <label for="content" aria-label="Post">Post</label>
                            <textarea v-model="post.content" placeholder="Vous pouvez modifier le post..." rows="10" cols="60" required aria-label="Message du post"></textarea>
                        </li>
                    </ul>
                </form>
                <button @click="modifyPost()" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Enregistrer</button>
            </section>
            <div>
                <router-link :to="`/post/${id_param}`" class="btnDelete" aria-label="Retour au fil d'actualité"><i class="fas fa-comment-slash"></i> Annuler</router-link>
            </div>
            <div>
                <router-link to="/allposts" aria-label="Retour vers Le fil d'actu de Groupomania"><i class="fas fa-home home"></i></router-link>
            </div>
        <Footer/>
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/FooterCompo";
export default {
    name: 'ModifyPost',
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            id_param: this.$route.params.id,
            post: [],
            createdAt: '',
            updatedAt:'',
            preview: null,
            button : false
        }
    },
    methods: {
        show: function () {
            return this.button = true;
        },
        User() {
            this.id = localStorage.getItem("Id")
            this.role = localStorage.getItem("role")
        },

        // Affichage d'un post
        getOnePost() {
            const token = localStorage.getItem("token")
            const fileField = document.querySelector('input[type="file"]');                                             
            axios.get(`http://localhost:3000/api/posts/${this.id_param}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then((res) => {
                console.log(res.data);
                this.users = res.data;
                this.posts = res.data;
                this.post.title = res.data.title;
                this.post.image = fileField.files[0];
                this.post.createdAt = res.data.createdAt;
                this.post.updatedAt = res.data.updatedAt;
            })
            .catch(() => console.log('Impossible de récupérer les posts !'))
        },

        // Modification d'un post
        modifyPost() {
            const token = localStorage.getItem("token")
            
            if (this.post.content === "")
                alert("Veuillez saisir votre post");
            if (this.post.title != "" && this.post.content != "") {
                let data = new FormData()
                data.append('content', this.post.content)
                axios.put(`http://localhost:3000/api/posts/${this.id_param}`, data,  {
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data
                })
                .then((res) => {
                    alert("Modification du post réussie")
                    console.log("Modification du post réussie");
                    this.posts = res.data
                    this.$router.push("/allposts");
                })
                .catch(() =>{ 
                    alert("Non autorisé à modifier ce post!!");
                    console.log('Non autorisé à modifier ce post!!')
                } )
            } else if (this.post.title != "" && this.post.content != "") {
                let data = new FormData()
                data.append('content', this.post.content)
                axios.put(`http://localhost:3000/api/posts/${this.id_param}`, data ,{
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: data
                })
                .then((res) => {
                    console.log(res.data);
                    this.posts = res.data;
                    this.post.content = res.data.content;
                    this.post.createdAt = res.data.createdAt;
                    this.post.updatedAt = res.data.updatedAt;

                    alert("Modification du post réussie");
                    console.log("Modification du post réussie");

                    this.posts = res.data
                    this.$router.push("/allposts");
                })
                    
                .catch(() =>{ 
                    alert("Non autorisé à modifier ce post!!");
                    console.log('Non autorisé à modifier ce post!!')
                })
            }
        },
        
        // Date 
        dateFormat (updatedDate) {
            const date = new Date(updatedDate)
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
            return date.toLocaleDateString('fr-FR', options);
        },
        hourFormat (updatedHour) {
            const hour = new Date(updatedHour)
            const options = { hour: 'numeric', minute:'numeric', second:'numeric'};
            return hour.toLocaleTimeString('fr-FR', options);
        },
    },
        mounted () {
            this.getOnePost()
        }
}
</script>

<style scoped>
form {
    width: 80% ; 
    margin: auto;
    display: flex;
    flex-direction: column;
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

.title {
    width: 30%;
    height: 30px;
    text-align: center;
    margin: 10px auto 0 auto;
    font-size: 20px;
    font-weight: bolder;
    color: black;
    text-align: center;
    border-radius: 20px;
}

textarea {
    width: 50%;
    height: 150px;
    margin: 15px auto 0 auto;
    font-size: 20px;
    font-weight: bolder;
    color: black;
    border-radius: 20px;
    padding-left: 10px;
}

.btnDelete{
    margin-top: 20px;
    background-color: #fac4cf;
}

.btnSave{
    margin-top:0;
    margin-bottom: 10px;
    background-color: #fac4cf;
}

@media screen and (min-width:768px) {
.btnDelete{
    width: 20%;
    margin: auto;
}
}
</style>