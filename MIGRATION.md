# Migration Vue.js → React/Next.js

## Structure des branches

### 🌿 `vue-legacy`
Code original du projet (Mai 2022) - Projet 7 OpenClassrooms

**Stack technique:**
- **Frontend:** Vue.js 3 + Vuex + Vue Router + Vuetify
- **Backend:** Node.js + Express + Sequelize + MySQL

**Fonctionnalités:**
- Authentification utilisateur (signup/login)
- Création et modification de posts
- Système de commentaires
- Likes et dislikes
- Profil utilisateur

### 🚀 `master`
Code React/Next.js stable (Octobre 2025)

**Stack technique:**
- **Frontend:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + Sequelize + MySQL

**Améliorations vs Vue.js:**
- TypeScript pour la sécurité du typage
- Next.js 15 avec App Router (SSR, SSG)
- Sécurité renforcée (helmet, rate limiting, validation)
- Système de logging avec Winston
- Documentation API avec Swagger
- Tests unitaires avec Jest
- CI/CD avec GitHub Actions
- Optimisation des images avec Sharp

### 🔧 `react-migration`
Branche de développement pour la migration React

## Chronologie

- **Mai 2022** : Projet initial avec Vue.js 3
- **Octobre 2025** : Migration vers React/Next.js 15
  - Réarchitecture complète du frontend
  - Ajout de TypeScript
  - Implémentation des bonnes pratiques de sécurité
  - Mise en place de tests et CI/CD

## Raisons de la migration

1. **TypeScript** : Meilleure maintenabilité et moins d'erreurs
2. **Next.js** : SEO, performances (SSR/SSG), routing optimisé
3. **Écosystème React** : Plus grande communauté et librairies
4. **Modernisation** : Stack technique plus récente et pérenne

## Comment naviguer entre les branches

```bash
# Voir le code Vue.js original
git checkout vue-legacy

# Voir le code React stable
git checkout master

# Travailler sur la migration
git checkout react-migration
```

## Backend

Le backend est resté similaire entre les deux versions, avec ajout de :
- Validation robuste avec express-validator
- Logging professionnel
- Documentation Swagger
- Tests unitaires
- Rate limiting et protections de sécurité
