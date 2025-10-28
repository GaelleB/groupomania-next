Projet 7 de la formation développeur web d'OpenClassrooms : Création d'un réseau social pour l'entreprise Groupomania			

Utilisation de NodeJs, Express, Sequelize et Mysql pour le backend
Utilisation du framework VueJs 3 pour le frontend

Clonez le repository

Depuis le dossier backend :
- npm install
- npx sequelize db:create (pour créer la base de donnée en la nommant groupomania)
- npx sequelize db:migrate (pour créer les migrations)

- Retrouver dans le fichier .env (backend) le nom de l'utilisateur et le mot de passe pour se connecter à la base de données

Puis lancer le server (toujours dans le dossier backend)
- nodemon server 

Depuis le dossier frontend :
- npm install
- npm run serve (pour lancer l'app)