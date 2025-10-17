# Groupomania - Frontend Next.js

Réseau social d'entreprise migré de Vue.js vers Next.js avec TypeScript et CSS Modules.

## 🚀 Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **CSS Modules** - Styles scopés par composant
- **Axios** - Requêtes HTTP
- **Context API** - Gestion d'état pour l'authentification

## 📁 Structure du projet

```
src/
├── app/                    # Pages et routes (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── login/             # Page de connexion
│   ├── signup/            # Page d'inscription
│   ├── posts/             # Pages liées aux posts
│   │   ├── page.tsx       # Liste des posts
│   │   ├── new/           # Créer un post
│   │   └── [id]/          # Détails et édition d'un post
│   └── profile/           # Page de profil
├── components/            # Composants réutilisables
│   ├── Header.tsx
│   └── Footer.tsx
├── contexts/              # Contexts React
│   └── AuthContext.tsx    # Gestion de l'authentification
├── lib/                   # Utilitaires
│   └── axios.ts          # Instance Axios configurée
└── types/                 # Types TypeScript
    └── index.ts          # Types de l'application
```

## 🛠️ Installation

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Vérifier que le backend est lancé** :
   Le backend Express doit tourner sur `http://localhost:3000`

## 🏃 Lancement

```bash
# Mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:3001` (ou le prochain port disponible).

## 🔑 Fonctionnalités

### Authentification
- ✅ Inscription avec nom, prénom, email et mot de passe
- ✅ Connexion
- ✅ Déconnexion
- ✅ Protection des routes (redirection si non connecté)
- ✅ Persistance de la session (localStorage + Context)

### Posts
- ✅ Afficher tous les posts
- ✅ Créer un nouveau post (avec titre optionnel et image)
- ✅ Voir les détails d'un post
- ✅ Modifier ses propres posts
- ✅ Supprimer ses propres posts

### Profil
- ✅ Voir son profil (nom, prénom, email, rôle)

## 📝 Routes disponibles

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil (redirige vers /posts si connecté) |
| `/login` | Connexion |
| `/signup` | Inscription |
| `/posts` | Liste de tous les posts |
| `/posts/new` | Créer un nouveau post |
| `/posts/[id]` | Détails d'un post |
| `/posts/[id]/edit` | Modifier un post |
| `/profile` | Profil utilisateur |

## 🎨 CSS Modules

Chaque composant/page a son propre fichier CSS Module :
- Les classes sont scopées automatiquement
- Pas de conflit de noms entre composants
- Import via `import styles from './Component.module.css'`
- Utilisation : `className={styles.maClasse}`

## 🔄 Migration depuis Vue.js

### Changements principaux

| Vue.js | Next.js / React |
|--------|-----------------|
| `v-model` | `value` + `onChange` |
| `@click` | `onClick` |
| `v-if` | `{condition && <Component />}` |
| `v-for` | `.map()` |
| Vuex store | Context API |
| Vue Router | Next.js App Router (dossiers) |
| `<script setup>` | `'use client'` + hooks |

### Exemple de conversion

**Vue.js** :
```vue
<template>
  <input v-model="email" @change="handleChange" />
</template>

<script>
export default {
  data() {
    return { email: '' }
  }
}
</script>
```

**Next.js / React** :
```tsx
'use client';
import { useState } from 'react';

export default function Component() {
  const [email, setEmail] = useState('');

  return (
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}
```

## 🔧 Configuration du backend

Le frontend communique avec le backend Express sur `http://localhost:3000/api`.

Si votre backend tourne sur un autre port, modifiez `src/lib/axios.ts` :

```typescript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:VOTRE_PORT/api',
  // ...
});
```

## 📦 Scripts disponibles

```bash
npm run dev          # Lancer en mode développement
npm run build        # Compiler pour la production
npm run start        # Lancer en mode production
npm run lint         # Vérifier le code avec ESLint
```

## 🐛 Débogage

### L'application ne se connecte pas au backend
- Vérifiez que le backend est bien lancé
- Vérifiez la configuration CORS du backend
- Ouvrez la console du navigateur pour voir les erreurs

### Erreur "localStorage is not defined"
- Normal côté serveur Next.js
- Vérifiez que vous utilisez `'use client'` en haut des composants qui utilisent localStorage

### Les styles ne s'appliquent pas
- Vérifiez l'import du fichier `.module.css`
- Vérifiez que vous utilisez `styles.className` et non `"className"`

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [CSS Modules](https://github.com/css-modules/css-modules)

## ✨ Prochaines étapes suggérées

- [ ] Ajouter la gestion des commentaires
- [ ] Ajouter la gestion des likes
- [ ] Améliorer l'upload d'images (preview, compression)
- [ ] Ajouter la pagination des posts
- [ ] Implémenter le mode admin
- [ ] Ajouter des tests (Jest, React Testing Library)
- [ ] Migrer le backend vers Next.js API Routes (optionnel)
