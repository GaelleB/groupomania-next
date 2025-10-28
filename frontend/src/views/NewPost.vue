<template>
    <div>
        <HeaderProfile/>
            <section>
                <h1><i class="far fa-edit"></i><br>Rédiger un post</h1>
                <form>
                    <ul>
                        <li>
                            <input type="text" v-model="title" placeholder="Titre" size="50" required aria-label="Titre du post">
                        </li> 
                        <li>
                            <textarea v-model="content" placeholder="Rédigez votre post" rows="10" cols="60" required aria-label="Post"></textarea>
                        </li>
                        <li v-if="image">
                            <img :src="image" alt="Image du post" class="file">
                        </li>
                        <li>
                            <input type="file" accept=".jpeg, .jpg, .png, .webp, .gif" v-on:change="imgPost" id="file" class="input-file" aria-label="Image du post">
                            <label v-if="!image" for="file" class="label-file" aria-label="Choisir une image pour ce post"></label>
                            <button v-else @click="deletefile()" class="label-file btnDelete" aria-label="Supprimer l'image du post"><i class="far fa-trash-alt"></i> Supprimer image</button>
                        </li>
                    </ul>
                </form>
                <button @click="createPost()" class="btnSave" aria-label="Créer ce post">Publier</button>
            </section>
        <Footer/>
    </div>
</template>

<script>
import axios from 'axios'
import HeaderProfile from "../components/HeaderProfile";
import Footer from "../components/FooterCompo";
export default {
    name: 'NewPost',
    components: {
        HeaderProfile,
        Footer
    },
    data() {
        return {
            post: [],
            title: '',
            content: '',
            image: '',
            contentType: 'text',
            preview: null,
            
        }
    },
    methods: {
        createPost() {
            const Id = (localStorage.getItem("userId"))
            const fileField = document.querySelector('input[type="file"]');
            const token = (localStorage.getItem("token"))

            if (this.title === '')
                alert("Veuillez saisir le titre du post")

            if (this.content === '')
                alert("Veuillez saisir le contenu du post")

            if (this.image === '' && this.title) { 
                let data = new FormData()
                data.append('title', this.title)
                data.append('content', this.content)
                data.append('userId', Id)
                if (fileField.files[0]) {
                    data.append('image', fileField.files[0]);
                }
                axios.post("http://localhost:3000/api/posts/newpost", data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'authorization': `Bearer ${token}`
                    },
                })
                .then(() => {
                    alert("Post publié")
                    this.$router.push("/allposts");
                    console.log('Post publié ')
                });
            };  
        }
    },
        mounted(){
    }
}
</script>

<style scoped>
section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

h1 {
    font-size: 20px;
}

form {
    padding-left: 800px;
    width: 100%;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    display: flex;
    flex-direction: column;
    align-content: center;
    margin-bottom: 30px;
}

input, textarea {
    width: 50%;
    font-size: 15px;
    border: 2px solid black;
    border-radius: 20px;
    padding-left: 15px;
}

img {
    width: 70%;
    border-radius: 30px;
    margin: auto;
}

#file {
    border: none;
}

.btnSave {
    background-color: #fac4cf;
}

.link {
    text-decoration: none;
    color: #000000;
}

@media screen and (max-width:1024px){
    .btnDelete{
        width: 50%;
        margin: 0 auto 0 auto;
    }
}

@media screen and (max-width:768px){
    form {
        padding-left: 110px;
        width: 60%;
    }

    .btnDelete{
        width: 50%;
        margin: 0 auto 0 auto;
    }
}
</style>