<template>
    <div>
        <HeaderProfile/>
            <section >
                <article class="header">
                    <!-- Affichage d'un post --> 
                    <div class = "card info blockRespo" >
                        <nav class = "blockRespoText">
                        <input class="inputTitle" type="text" v-model="post.title" required aria-label="Titre" disabled size="50" >  <!--rows="10" cols="25" -->
                        <textarea type="text" v-model="post.content" required aria-label="Message" disabled ></textarea>
                    
                            <!-- Modification d'un post -->  
                            <div class="content modif">
                                <button v-if="userIdToken === UserId" @click="modifyPost()" class="btnSave" aria-label="Modifier ce post"><i class="fas fa-edit"></i> Modifier le post</button>
                            </div> 
                        </nav>
                        <img class="imgPost" v-if="post.image" :src="post.image" alt="Image du post">
                    </div>

                    <!-- Like/Dislike -->
                    <div class="like">
                        <i class="fas fa-thumbs-up like btnSave likeIcon" @click="createLike()" aria-label="Bouton like"> {{Likes.length}}</i>
                        <i class="fas fa-thumbs-down like btnDelete likeIcon" @click="createDislike()" aria-label="Bouton dislike"> {{Dislikes.length}}</i>
                    </div> 
                </article>

                <!-- Création d'un commentaire -->
                <button v-if="displayCreateComment === false" v-on:click="show2" class="btnSave" aria-label="Ecrire un commentaire"><i class="far fa-comment"></i>Commenter</button>
                <article v-if="displayCreateComment" class="createcomment">
                    <textarea v-model="content" placeholder="Ecrire ton commentaire..." cols="60" rows="5" aria-label="Message du commentaire"></textarea>
                    <div class=btnComment>
                        <button @click="createComment()" class="btnSave" aria-label="Envoyer le commentaire">Envoyer</button>
                        <button v-on:click="hide2" class="btnDelete" aria-label="Annuler le commentaire">Annuler</button>
                    </div>
                </article>

                <!-- Affichage d'un commentaire -->
                <button  v-on:click="show" @click="getPostComment()" class="btnSave" aria-label="Voir les commentaires">Afficher: {{ comments.length }} commentaires </button>
                    <table class="header " v-if="displaycomment" >
                        <h2>Les commentaires</h2>
                        <tr class="card displayComment" v-bind:key="index" v-for="(comment, index) in comments" >
                            <p>
                                Commenté par
                                <b>{{ comment.User.prenom }}</b> <b>{{ comment.User.nom }}</b>
                            </p>
                            <p>
                                le <b>{{ dateFormat(comment.createdAt) }}</b>
                                à <b>{{ hourFormat(comment.createdAt) }}</b>
                            </p>
                            <td>
                                <textarea type="text" v-model="comment.content" required aria-label="Commentaire" disabled></textarea>
                            </td>

                            <!-- Suppression d'un commentaire -->  
                            <div class="content-displayComment">
                                <div class="modifComment">                                                                   
                                    <button v-if="userIdToken == comment.userId" @click="deleteComment(index)" class="btnDelete" aria-label="Supprimer ce commentaire"><i class="far fa-trash-alt"></i> Supprimer commentaire</button>
                                    <button v-on:click="hide" class="btnDelete" aria-label="Masquer les commentaires">Masquer les commentaires</button>
                                </div>
                            </div>  
                        </tr>    
                    </table>
            </section>
        <Footer/>
    </div>
</template>

<script>
import axios from 'axios';
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/FooterCompo";
export default {
    name: 'PostView',
    components: {
        HeaderProfile,
        Footer,
    },
    data () {
        return {
            userIdToken: JSON.parse(localStorage.getItem("userId")),
            id_param: this.$route.params.id,
            postId: this.$route.params.id,
            users: [],
            props: ['post'],
            posts: [],
            preview: null,
            post: {
                title:'',
                content:'',
                createdAt:'',
                updatedAt:'',
                id:'',
                image:'',
                user: { },
                userId:'',
            },
            user : {
                nom: '',
                prenom: '',
            },
            userId:'',
            comments: [],
            Likes: [],
            Dislikes: [],
            id:'',
            content: '',
            role: '',
            displaycomment: false,
            displayCreateComment: false,
        }
    },
    methods : {
        show: function () {
            return this.displaycomment = true;
        },
        hide: function () {
            return this.displaycomment = false;
        },
        show2: function () {
            return this.displayCreateComment = true;
        },
        hide2: function () {
            return this.displayCreateComment = false;
        },
        User() {
            this.id = localStorage.getItem("userId")
            this.role = localStorage.getItem("role")
        },

        // Affichage d'un post
        getOnePost() {
            const token = localStorage.getItem("token")
            axios.get(`http://localhost:3000/api/posts/${this.postId}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
                .then((res) => {
                console.log(res);
                console.log(res.data.image);
                this.posts = res.data;
                this.users = res.data;
                this.post.title = res.data.title;
                this.post.content = res.data.content;
                this.post.image = res.data.image;
                this.post.createdAt = res.data.createdAt;
                this.post.updatedAt = res.data.updatedAt;
                this.user.nom = res.data.nom ;
                this.user.prenom = res.data.prenom 
                this.Likes = res.data.Likes;
                this.Dislikes = res.data.Dislikes;
                this.UserId = res.data.UserId;
            })
            .catch(() => console.log('Impossible de récupérer le post!'))
        },

        // Date 
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
        deletePost () {
            const token = localStorage.getItem("token")
            if (confirm("Voulez-vous vraiment supprimer le post") === true) {
                axios.delete(`http://localhost:3000/api/posts/${this.id_param}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })
                .then((res) => {
                alert ("Post supprimée")
                console.log(res.data);
            })
            .catch(() =>{ 
                alert("Non autorisé à supprimer ce post!!")
                console.log('Non autorisé à supprimer ce post!!')
            })
        }
        },

        // Modification d'un post
        modifyPost () {
            this.$router.push(`/postmodify/${this.id_param}`)
        },
        
        // Création d'un commentaire
        createComment () {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId")
            const postId = this.$route.params.id;
            if( this.commentaire === ""){
                alert('Saisissez votre commentaire')
            } else {
                let data = {
                    content: this.content,
                    postId: postId,
                    userId: userId,
                }
                console.log(data)                                     
                axios.post("http://localhost:3000/api/comments/" ,data, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: data
                })
                .then(() => {
                    alert("Commentaire publié")
                    console.log("Commentaire publié")
                    this.content=""
                    this.getPostComment()
                    this.hide2()
                })
                .catch(() => console.log(' err comments'))
            }
        },

        // Affichage des commentaires sur un post
        getPostComment() {
            const token = localStorage.getItem("token")              
            axios.get(`http://localhost:3000/api/comments/${this.postId}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            .then((res) => {
                this.posts = res.data;
                this.users = res.data;
                this.comments = res.data;
                this.user.prenom = res.data.prenom 
                this.user.nom = res.data.nom;
                this.comments.content = res.data.content;
                this.comments.createdAt = res.data.createdAt;
                this.comments.updatedAt = res.data.updatedAt;
            })
            .catch(() => console.log('Impossible de récupérer le commentaire!'))
        },
        
        // Suppression d'un commentaire
        deleteComment (index) {
            const token = localStorage.getItem("token")
            if (confirm("Voulez-vous vraiment supprimer ce commentaire") === true) {
                console.log(this.comments[index].id)
                axios.delete(`http://localhost:3000/api/comments/${this.comments[index].id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
                .then((res) => {
                    alert("Commentaire supprimé")
                    this.getPostComment()
                    console.log(res.data);
                })
                .catch(() => {
                    alert("Non autorisé à supprimer ce commentaire!!")
                    console.log('Non autorisé à supprimer ce commentaire!!')})
            }
        },

        // Like
        createLike() {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId")
            const postId = this.$route.params.id; 
            
            let data = {
                postId: postId,
                userId: userId,
            }
            axios.post(`http://localhost:3000/api/posts/${this.id_param}/like`,data, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: data 
            })             
            .then((res)=>
                { 
                    console.log(res)
                    this.getOnePost()
                }

            )
            .catch((error) => {console.log(error) });
        },

        // Dislike
        createDislike() {
                const token = localStorage.getItem("token")
                const userId = localStorage.getItem("userId")
                const postId = this.$route.params.id; 
                
                let data = {
                    postId: postId,
                    userId: userId
                }
            axios.post(`http://localhost:3000/api/posts/${this.id_param}/dislike`,data, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: data 
            })             
            .then((res)=> { 
                console.log(res)
                this.getOnePost()
            }
            )
            .catch((error) => {console.log(error) });
        },
    },
    mounted(){
        this.User()
        this.getOnePost()
        this.getPostComment()
    }
}
</script>

<style scoped>
section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 0 auto;
}

article {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid black;
    border-radius: 20px;
    margin: 0 auto 0 auto;
}

.inputTitle {
    width: 80%;
    height: 30px;
    margin-top: 10px;
    color: #000000;
    text-align: center ;
    font-size: 20px;
    font-weight: bolder;
    border-radius: 20px;
    margin: 10px auto 10px auto;
}

textarea {
    width: 80%;
    height: 100px;
    font-size: 15px;
    margin: auto;
    border-radius: 20px;
    padding-left: 15px;
}

.modif {
    margin: 0;
}

.btnSave, .btnDelete {
    margin: 10px 0 10px 20px;
    background-color: #fac4cf;
    padding: 10px;
}

.imgPost {
    width: 30%;
    margin: auto;
    padding-right: 50px;
    border-radius: 20px;
}

.like {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0 10px;
    padding: 10px 20px;
}

table {
    widows: 100%;
}

.createcomment {
    border: none;
    margin: 20px 0;

}

.displayComment {
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    border-radius: 20px;
}

.content-displayComment {
    border: none;
}
.btnComment{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

/*--------------------*/
@media screen and (min-width:768px) {
    .blockRespo {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    
    .blockRespoText {
        display: flex;
        flex-direction: column;
    }
    
    .content {
        width: 100%;
    }

    .header {
        width: 50%;
    }

    section{
        width: 95%;
    }

    .button {
        width: 50%;
    }
    
    .imgPost {
        width: 20%;
        height: 30%;
        border-radius: 10px;
    }

    .createcomment {
        width: 100%;
    }
}
</style>