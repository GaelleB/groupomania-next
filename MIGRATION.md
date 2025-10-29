# Migration Vue.js -> React/Next.js

## Structure des branches

### Branche `vue-legacy`
Code original du projet (mai 2022) - Projet 7 OpenClassrooms

**Stack technique :**
- **Frontend :** Vue.js 3 + Vuex + Vue Router + Vuetify
- **Backend :** Node.js + Express + Sequelize + MySQL

**Fonctionnalités :**
- Authentification utilisateur (inscription/connexion)
- Création et modification de posts
- Système de commentaires
- Likes et dislikes
- Profil utilisateur

### Branche `master`
Code React/Next.js stable (octobre 2025)

**Stack technique :**
- **Frontend :** Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend :** Node.js + Express + Sequelize + MySQL

**Améliorations vs Vue.js :**
- Ajout de TypeScript pour sécuriser le typage
- Next.js 15 avec App Router (SSR, SSG)
- Sécurité renforcée (Helmet, rate limiting, validation)
- Système de logging avec Winston
- Documentation API avec Swagger
- Tests unitaires avec Jest
- CI/CD avec GitHub Actions
- Optimisation des images avec Sharp

### Branche `react-migration`
Branche de développement active pour la migration React

## Chronologie

- **Mai 2022** : projet initial avec Vue.js 3
- **Octobre 2025** : migration vers React/Next.js 15
  - Réarchitecture complète du frontend
  - Ajout de TypeScript
  - Implémentation des bonnes pratiques de sécurité
  - Mise en place de tests et de la CI/CD

## Raisons de la migration

1. **TypeScript** : meilleure maintenabilité et moins d'erreurs
2. **Next.js** : SEO, performances (SSR/SSG), routing optimisé
3. **Écosystème React** : communauté plus large et nombreuses librairies
4. **Modernisation** : stack technique plus récente et pérenne

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

Le backend reste globalement identique entre les deux versions, avec plusieurs ajouts :
- Validation robuste avec express-validator
- Logging professionnel
- Documentation Swagger
- Tests unitaires
- Rate limiting et protections de sécurité
