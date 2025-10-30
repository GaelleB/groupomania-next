# Guide de déploiement Groupomania

## Déploiement du Backend sur Render.com

### 1. Créer un compte Render
- Allez sur https://render.com
- Créez un compte (avec GitHub)

### 2. Créer une base de données MySQL
1. Dans le dashboard Render, cliquez sur "New +"
2. Sélectionnez "MySQL"
3. Configurez:
   - **Name**: groupomania-db
   - **Region**: Frankfurt (EU Central) ou le plus proche
   - **Plan**: Free
4. Cliquez sur "Create Database"
5. Notez les informations de connexion:
   - **Hostname**
   - **Port**
   - **Database**
   - **Username**
   - **Password**

### 3. Déployer le Backend
1. Cliquez sur "New +" puis "Web Service"
2. Connectez votre dépôt GitHub `groupomania-next`
3. Configurez:
   - **Name**: groupomania-backend
   - **Region**: Frankfurt (EU Central)
   - **Branch**: master
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. Ajoutez les variables d'environnement:
   - `NODE_ENV`: `production`
   - `DB_HOST`: [hostname de votre MySQL Render]
   - `DB_USER`: [username de votre MySQL]
   - `DB_PASSWORD`: [password de votre MySQL]
   - `DB_NAME`: [database name de votre MySQL]
   - `JWT_SECRET`: [générez une clé secrète aléatoire, ex: `openssl rand -base64 32`]
   - `PORT`: `3001` (ou laissez vide, Render définira automatiquement)

5. Cliquez sur "Create Web Service"

6. Une fois déployé, notez l'URL du backend (ex: `https://groupomania-backend.onrender.com`)

### 4. Créer les tables de la base de données
Une fois le backend déployé, vous devrez exécuter les migrations Sequelize. Vous pouvez:
- Utiliser le shell Render pour exécuter: `npx sequelize-cli db:migrate`
- Ou créer les tables manuellement avec un client MySQL

## Déploiement du Frontend sur Vercel

### 1. Créer un compte Vercel
- Allez sur https://vercel.com
- Connectez-vous avec GitHub

### 2. Importer le projet
1. Cliquez sur "Add New Project"
2. Importez votre dépôt `groupomania-next`
3. Configurez:
   - **Framework Preset**: Next.js (détecté automatiquement)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Variables d'environnement
Ajoutez dans les paramètres Vercel:
- `NEXT_PUBLIC_API_URL`: `https://groupomania-backend.onrender.com/api`

### 4. Déployer
1. Cliquez sur "Deploy"
2. Attendez quelques minutes
3. Votre site sera disponible sur une URL comme `https://groupomania-next.vercel.app`

## Configuration CORS
Le backend est déjà configuré pour accepter les requêtes depuis n'importe quelle origine. Si vous voulez restreindre:

Dans `backend/app.js`, modifiez:
```javascript
app.use(cors({
  origin: 'https://votre-frontend.vercel.app'
}));
```

## Notes importantes
- Le plan gratuit de Render met le service en veille après 15 min d'inactivité
- Le premier accès après une période d'inactivité peut prendre 30-60 secondes
- Render Free offre 750h/mois (suffisant pour un projet de démonstration)
- Vercel Free offre un déploiement illimité pour les projets personnels
