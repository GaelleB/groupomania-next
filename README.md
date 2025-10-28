# Groupomania - Réseau Social d'Entreprise

Projet 7 de la formation Développeur Web d'OpenClassrooms : Création d'un réseau social pour l'entreprise Groupomania.

## À propos

Groupomania est un réseau social interne permettant aux employés de :
- Partager des posts et des médias
- Commenter et interagir avec les publications
- Gérer leur profil utilisateur
- Liker et disliker les contenus

> **Note :** Ce projet a été initialement développé en Vue.js 3 en mai 2022, puis migré vers React/Next.js en octobre 2025. Pour consulter l'ancien code Vue.js, voir la branche `vue-legacy`. Plus d'infos dans [MIGRATION.md](./MIGRATION.md).

## Stack Technique

### Frontend
- **Next.js 15** avec App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Axios** pour les requêtes API

### Backend
- **Node.js** + **Express**
- **Sequelize** (ORM)
- **MySQL** (Base de données)
- **JWT** (Authentification)
- **Multer** (Upload de fichiers)
- **Sharp** (Optimisation d'images)
- **Winston** (Logging)
- **Helmet** + **express-rate-limit** (Sécurité)
- **express-validator** (Validation)

### DevOps & Qualité
- **Jest** + **Supertest** (Tests)
- **ESLint** + **Prettier** (Qualité de code)
- **GitHub Actions** (CI/CD)
- **Swagger** (Documentation API)

## Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MySQL
- npm ou yarn

### 1. Cloner le repository
```bash
git clone https://github.com/GaelleB/groupomania-next.git
cd groupomania-next
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

Configurer les variables d'environnement dans `.env` :
```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=groupomania
JWT_SECRET=your_secret_key
PORT=3001
```

Créer et initialiser la base de données :
```bash
npx sequelize db:create
npx sequelize db:migrate
```

Lancer le serveur backend :
```bash
npm run dev
# ou
nodemon server
```

Le serveur backend sera accessible sur `http://localhost:3001`

### 3. Configuration du Frontend

```bash
cd ../frontend
npm install
```

Créer un fichier `.env.local` :
```bash
cp .env.example .env.local
```

Configurer l'URL de l'API :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Lancer l'application frontend :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités

### Authentification
- Inscription avec validation des données
- Connexion sécurisée avec JWT
- Protection des routes

### Gestion des Posts
- Création de posts avec ou sans image
- Modification et suppression de ses propres posts
- Affichage du fil d'actualité

### Interactions Sociales
- Système de commentaires
- Likes et dislikes
- Fil d'actualité en temps réel

### Profil Utilisateur
- Page de profil personnelle
- Modification des informations
- Historique des posts

### Sécurité
- Rate limiting sur les endpoints sensibles
- Validation des données avec express-validator
- Protection CORS
- Helmet pour les en-têtes HTTP sécurisés
- Sanitisation des entrées utilisateur

## Scripts Disponibles

### Backend
```bash
npm run dev          # Lancer le serveur en mode développement
npm test            # Lancer les tests
npm run lint        # Vérifier le code avec ESLint
```

### Frontend
```bash
npm run dev         # Lancer Next.js en mode développement
npm run build       # Build pour la production
npm start           # Lancer en mode production
npm run lint        # Vérifier le code avec ESLint
```

## Documentation API

La documentation Swagger est accessible sur `http://localhost:3001/api-docs` une fois le serveur backend lancé.

## Tests

Lancer les tests backend :
```bash
cd backend
npm test
```

## Déploiement

Le projet peut être déployé sur :
- **Frontend :** Vercel (recommandé pour Next.js)
- **Backend :** Render, Railway, ou tout service Node.js

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour plus de détails.

## Branches

- **`master`** : Code React/Next.js actuel (production)
- **`vue-legacy`** : Code Vue.js original (mai 2022)

Pour plus d'informations sur la migration, consultez [MIGRATION.md](./MIGRATION.md).

## Auteur

**Gaëlle Boucher**
- GitHub: [@GaelleB](https://github.com/GaelleB)

## Licence

Projet réalisé dans le cadre de la formation OpenClassrooms - Développeur Web.
