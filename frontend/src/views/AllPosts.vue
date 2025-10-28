<template>
    <div>
        <HeaderProfile/>
        <h1>Le fil d'actu de Groupomania</h1>
        <div class="getAllPosts">
            <button @click="getAllPosts()" class="btnSave" aria-label="Bouton d'actualisation de la page" ><i class="fas fa-redo"></i></button>
        </div>
        <article v-if="post in posts">
            <p>Aucun post pour l'instant!</p>
        </article>

        <!-- Création d'un post -->
        <router-link to="/postnew" aria-label="Création d'un nouveau post">
        <button  class="button" >
            <h2><i class="far fa-edit"></i><br>Rédiger un nouveau post</h2>
        </button>
        </router-link>
        <table>
            <tr class = "card cardPost" v-bind:key="index" v-for="(post, index) in posts">
                <td> <input type="text" v-model="post.title" required aria-label="Titre" disabled> </td>
                <td> <textarea class="tdHeight" type="text" v-model="post.content" required aria-label="Message" disabled></textarea> </td>
                <td class="icone">
                    <router-link  :to="`/post/${post.id}`" :href="$router.resolve({name: 'Post', params: { id: post.id}}).href" aria-label="Afficher le message">
                    <button class="btnIconeSave" aria-label="Modifier ce post" ><i class="far fa-edit"></i> Modifier</button>
                    </router-link>
                    <button v-if="userIdToken === post.UserId" @click="deletePost(index)" class="btnIconeDelete" aria-label="Supprimer ce post"><i class="far fa-trash-alt"></i> Supprimer</button>
                </td>
                <td class="info">
                    <p>
                        Posté par 
                            <b>{{ post.User.prenom }}</b> <b>{{ post.User.nom }}</b>
                        le <b>{{ dateFormat(post.createdAt) }}</b>
                        à <b>{{ hourFormat(post.createdAt) }}</b><br>
                    </p>
                    <p>
                        Modifié
                        le <b>{{ dateFormat(post.updatedAt) }}</b>
                        à <b>{{ hourFormat(post.updatedAt) }}</b>
                    </p>
                </td>
                <td>
                    <img class="imgPost" v-if="post.image" :src="post.image" alt="Image du post">
                </td>
            </tr> 
        </table>

        <!-- Affichage des posts -->
        <article v-if="posts.length == 0">
            <p>Aucun post pour le moment!</p>
        </article>
        <Footer/>
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/FooterCompo";
export default {
    name: 'AllPosts',
    props: ['post.id'],
    components: {
        HeaderProfile,
        Footer
    },
    data () {
        return {
            userIdToken: JSON.parse(localStorage.getItem("userId")),
            id_param: this.$route.params.id,
            postId: this.$route.params.id,
            users: [],
            props: ['post'],
            posts: [],
            user: {
                nom: '',
                prenom: ''
            }
        }
    },
    computed : {
        filterList() {
            return this.posts.filter((post) =>{
                return post.user.nom.toLowerCase().includes(this.search.toLowerCase());
            })
        }
    },
    methods : {
        // Affichage de tous les posts
        getAllPosts() {
            const token = localStorage.getItem("token")
            axios.get('http://localhost:3000/api/posts/', {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })    
            .then((res) => {
                console.log(res.data);
                this.posts = res.data;
                this.users = res.data;
            })
            .catch(() => console.log('Impossible de récupérer les posts !'))
        },

        // Date et heure 
        dateFormat (createdDate) {
            const date = new Date(createdDate)
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
            return date.toLocaleDateString('fr-FR', options);
        },
        hourFormat (createdHour) {
            const hour = new Date(createdHour)
            const options = { hour: 'numeric', minute:'numeric', second:'numeric'};
            return hour.toLocaleTimeString('fr-FR', options);
        },

        // Suppression d'un post
        deletePost (index) {
            const token = localStorage.getItem("token")
            if (confirm("Voulez-vous vraiment supprimer votre post?") === true) {
                axios.delete(`http://localhost:3000/api/posts/${this.posts[index].id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                })
                .then(() => {
                    console.log("Post supprimé");
                    this.getAllPosts()
                })
                
                .catch(() =>{ 
                    console.log('Non autorisé à supprimer ce post!!')
                })
            }
        },
        post () {
            this.$router.push("/allposts")
        }
    },
    mounted(){
        this.getAllPosts()
    }
}
</script>

<style scoped>
h1 {
    font-size: 30px;
}

h2 {
    color: black;
    font-size: 15px;
    margin: 0 auto 0 auto;
}

button {
    background-color: #fac4cf;
}

.info {
    font-size: 15px;
}

.article {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #000000;
}

p {
    font-weight: bold;
    font-size: 20px;
}

td {
    margin-top:10px;
}

.tdHeight {
    width: 85%;
    height: 100px;
    border: 2px 1px;
    border-radius: 20px;
    padding-left: 10px;
}

.cardPost {
    width: 50%;
    height: auto;
    margin: 10px auto 10px auto;
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    border-radius: 15px;
}

table {
    margin: 0 auto 0 auto ;
}

.header {
    border-radius: 20px 20px 0 0;
}

.search {
    margin-bottom: 50px;
    margin-top: 50px;
    width: 80%;
    height: 30px;
    border: 2px solid black;
    border-radius: 15px;
}

::placeholder {
    text-align: center;
    font-size: 14px;
}

input {
    width: 50%;
    height: 20%;
    font-size: 20px;
    text-align: center;
    border: black;
    border: 2px 1px;
    border-radius: 20px;
}

.icone{
    display: flex;
    justify-content: centre;
    margin: 10px auto 10px auto;
}

.btnIconeSave, .btnIconeDelete, .btnSave{
    width: 30px ;
    height: 30px ;
    margin: 10px;
    padding: 0px;
    border-radius: 10px;
}

.btnIconeSave{
    background-color: #fac4cf;
}

.btnIconeDelete{
    background-color: #fac4cf;
}

.text {
    font-size: 14px;
}

@media screen and (min-width:768px){
    table {
        width: 100%;
    }

    .btnIconeDelete, .btnIconeSave{
        width: 200px;
    }

    textarea{
        width: 90%
    }
    
    .imgPost {
        width: 20%;
        height: 30%;
        border-radius: 10px;
    }

    .icone{
        display: flex;
        justify-content: centre;
    }
}
</style>