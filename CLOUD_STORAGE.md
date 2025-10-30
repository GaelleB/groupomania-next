# Évaluation des Solutions de Stockage Cloud pour Images

**Date**: Janvier 2025
**Statut actuel**: Stockage local dans `backend/images/`
**Objectif**: Migration vers une solution cloud scalable

---

## 📊 Comparaison des Solutions

### 1. AWS S3 (Amazon Simple Storage Service)

#### ✅ Avantages
- **Leader du marché** avec 99.999999999% de durabilité
- **Performances** : CDN CloudFront intégré pour distribution mondiale
- **Flexibilité** : Contrôle total sur la configuration (buckets, policies, lifecycle)
- **Écosystème** : Intégration native avec autres services AWS (Lambda, CloudWatch)
- **Coûts prévisibles** : Pay-as-you-go avec free tier (5GB gratuits la 1ère année)

#### ❌ Inconvénients
- **Complexité** : Configuration IAM, buckets, policies peut être intimidante
- **Pas de transformation d'images** : Nécessite service additionnel (Lambda + Sharp ou Thumbor)
- **Vendor lock-in** : Migration complexe si changement de provider
- **Coûts cachés** : Bande passante sortante facturée séparément

#### 💰 Tarification (eu-west-3 - Paris)
- **Stockage** : ~0.023€/GB/mois
- **PUT/COPY/POST** : 0.005€ par 1000 requêtes
- **GET/SELECT** : 0.0004€ par 1000 requêtes
- **Transfert sortant** : 0.09€/GB (premiers 10TB)
- **Free Tier** : 5GB stockage + 20,000 GET + 2,000 PUT (12 mois)

**Estimation pour 100GB d'images + 1M requêtes/mois** : ~5-8€/mois

---

### 2. Cloudinary

#### ✅ Avantages
- **Spécialisé images/vidéos** : Optimisation automatique (format, qualité, compression)
- **Transformations à la volée** : Resize, crop, filters via URL params
- **CDN global inclus** : Distribution rapide sans configuration
- **Simple à intégrer** : SDK JavaScript/Node.js avec API intuitive
- **AI Features** : Auto-tagging, background removal, smart cropping
- **Gestion intelligente** : Détection formats optimaux (WebP, AVIF) selon navigateur

#### ❌ Inconvénients
- **Coûts plus élevés** : Facture rapidement si dépassement du plan gratuit
- **Vendor lock-in** : URLs Cloudinary difficiles à migrer
- **Limitations free tier** : 25 crédits/mois (transformations + stockage + bande passante)
- **Moins de contrôle** : Configuration moins granulaire qu'AWS

#### 💰 Tarification
- **Free Plan** :
  - 25 crédits/mois
  - 25GB stockage
  - 25GB bande passante
  - 25,000 transformations
- **Plus Plan** : 89€/mois (100 crédits)
- **Advanced Plan** : 205€/mois (200 crédits)

**Estimation pour 100GB + 1M transformations** : ~205€/mois (Advanced)

---

### 3. Supabase Storage

#### ✅ Avantages
- **Simple et moderne** : API REST + SDK TypeScript facile d'utilisation
- **Inclus dans Supabase** : Si déjà utilisé pour DB PostgreSQL
- **Transformations d'images** : Resize, format, quality via URL
- **Policies PostgreSQL** : Row Level Security pour contrôle d'accès fin
- **Open source** : Peut être self-hosted si besoin
- **Pricing abordable** : 100GB inclus dans plan Pro (25$/mois)

#### ❌ Inconvénients
- **Jeune plateforme** : Moins mature qu'AWS/Cloudinary (créé en 2020)
- **CDN limité** : Pas aussi performant que CloudFront ou Cloudinary CDN
- **Transformations limitées** : Moins de features qu'Cloudinary
- **Écosystème plus petit** : Moins d'intégrations tierces

#### 💰 Tarification
- **Free Plan** : 1GB stockage + 2GB bande passante
- **Pro Plan** : 25$/mois → 100GB stockage + 200GB bande passante
- **Team Plan** : 599$/mois → 200GB + 600GB bande passante

**Estimation pour 100GB + bande passante raisonnable** : 25$/mois (Pro)

---

### 4. DigitalOcean Spaces

#### ✅ Avantages
- **Compatible S3** : API compatible AWS S3 (migration facile)
- **Prix fixe simple** : 5$/mois pour 250GB + 1TB transfert
- **CDN inclus** : DigitalOcean CDN sans coût supplémentaire
- **Pas de frais cachés** : Overages à 0.02$/GB (stockage) et 0.01$/GB (transfert)
- **Simple à configurer** : Interface plus intuitive qu'AWS

#### ❌ Inconvénients
- **Pas de transformations** : Nécessite Sharp ou service externe
- **Moins de régions** : 9 datacenters vs 30+ pour AWS
- **Pas d'AI features** : Fonctionnalités basiques uniquement
- **Support limité** : Pas de support 24/7 sur plan de base

#### 💰 Tarification
- **Spaces Plan** : 5$/mois → 250GB stockage + 1TB transfert sortant
- **Overage** : 0.02$/GB stockage + 0.01$/GB transfert

**Estimation pour 100GB + usage normal** : 5$/mois

---

## 🏆 Recommandations par Cas d'Usage

### Pour Groupomania (MVP / Petite entreprise)

**🥇 1. DigitalOcean Spaces**
- **Pourquoi** : Rapport qualité/prix imbattable (5$/mois flat)
- **Idéal si** : Budget limité, stockage < 250GB, transformations faites côté backend (Sharp)
- **Migration** : Compatible S3 → facilite transition vers AWS plus tard

**🥈 2. Supabase Storage**
- **Pourquoi** : Moderne, simple, inclus transformations basiques
- **Idéal si** : Déjà utilisé Supabase pour DB, besoin de RLS policies
- **Bonus** : Open-source donc exit strategy claire

**🥉 3. AWS S3 + CloudFront**
- **Pourquoi** : Solution professionnelle, scalabilité illimitée
- **Idéal si** : Prévision de forte croissance, besoin de contrôle total
- **Note** : Coûts prévisibles uniquement si usage bien estimé

**❌ Cloudinary**
- **Pourquoi déconseillé** : Trop cher pour le cas d'usage actuel
- **Idéal si** : E-commerce avec milliers de produits nécessitant des variants (thumbnails, zooms)
- **Reconsi

dérer si** : Besoin de features AI (auto-tagging, background removal)

---

## 🔄 Plan de Migration Recommandé

### Phase 1 : Préparation
1. **Abstractionlayer** : Créer interface `IStorageService`
   ```typescript
   interface IStorageService {
     upload(file: Buffer, path: string): Promise<string>;
     delete(path: string): Promise<void>;
     getUrl(path: string): string;
   }
   ```
2. **Implémentations** : LocalStorage, S3Storage, SpacesStorage
3. **Configuration** : Variable d'environnement `STORAGE_PROVIDER`

### Phase 2 : Intégration DigitalOcean Spaces
1. Installer SDK : `npm install @aws-sdk/client-s3` (compatible)
2. Configurer credentials + endpoint
3. Migrer logique upload dans `SpacesStorage`
4. Tester en parallèle (upload local ET Spaces)

### Phase 3 : Migration données
1. Script de migration : `/backend/scripts/migrate-to-spaces.js`
2. Upload images existantes vers Spaces
3. Mise à jour BDD avec nouvelles URLs
4. Validation manuelle échantillon

### Phase 4 : Basculement
1. Changer `STORAGE_PROVIDER=spaces` en production
2. Monitoring 48h pour détecter erreurs
3. Suppression images locales après 1 semaine de stabilité

---

## 📝 Code Example : Abstraction Layer

```typescript
// backend/services/storage/IStorageService.ts
export interface IStorageService {
  upload(file: Buffer, filename: string, mimetype: string): Promise<string>;
  delete(url: string): Promise<void>;
  getPublicUrl(key: string): string;
}

// backend/services/storage/SpacesStorage.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export class SpacesStorage implements IStorageService {
  private client: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor() {
    this.client = new S3Client({
      endpoint: process.env.SPACES_ENDPOINT, // e.g., https://fra1.digitaloceanspaces.com
      region: process.env.SPACES_REGION || 'fra1',
      credentials: {
        accessKeyId: process.env.SPACES_KEY!,
        secretAccessKey: process.env.SPACES_SECRET!,
      },
    });
    this.bucket = process.env.SPACES_BUCKET!;
    this.cdnUrl = process.env.SPACES_CDN_URL!;
  }

  async upload(file: Buffer, filename: string, mimetype: string): Promise<string> {
    const key = `images/${Date.now()}-${filename}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ACL: 'public-read',
        ContentType: mimetype,
      })
    );

    return this.getPublicUrl(key);
  }

  async delete(url: string): Promise<void> {
    const key = url.split('/').slice(-2).join('/'); // Extract key from URL

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  getPublicUrl(key: string): string {
    return `${this.cdnUrl}/${key}`;
  }
}

// backend/services/storage/index.ts
import { IStorageService } from './IStorageService';
import { LocalStorage } from './LocalStorage';
import { SpacesStorage } from './SpacesStorage';

export function getStorageService(): IStorageService {
  const provider = process.env.STORAGE_PROVIDER || 'local';

  switch (provider) {
    case 'spaces':
      return new SpacesStorage();
    case 'local':
    default:
      return new LocalStorage();
  }
}
```

---

## ✅ Conclusion

**Pour Groupomania, la recommandation est DigitalOcean Spaces** :
- ✅ Coût fixe prévisible (5$/mois)
- ✅ Compatible S3 (exit strategy facile)
- ✅ CDN inclus
- ✅ Simple à configurer
- ✅ Suffit pour MVP et croissance initiale

**Migration à planifier dans les 2-3 prochains sprints** une fois le MVP stabilisé.
