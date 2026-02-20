# 🎒 BagExpress - Plateforme Cloud de Livraison de Bagages

> **Projet universitaire M2 Sorbonne - Cloud Computing**

BagExpress est une plateforme full-stack permettant de connecter des voyageurs avec des chauffeurs pour la livraison de leurs bagages depuis les gares vers les hôtels. Voyagez léger, on s'occupe du reste !

**🌐 Démo en ligne:** [Lien Vercel à venir]

---

## ✨ Fonctionnalités Principales

### 👤 Côté Client
- ✅ **Authentification sécurisée** (Signup/Login avec NextAuth v4)
- 📝 **Réservation en 3 étapes** avec sélection interactive sur carte
- 🗺️ **Carte OpenStreetMap** pour visualiser pickup & delivery
- 📊 **Dashboard client** avec historique et suivi en temps réel
- 🌍 **Support multilingue** (8 langues: EN, FR, DE, ES, PT, JA, ZH, RU)
- 📱 **Responsive design** optimisé mobile

### 🚗 Côté Chauffeur
- 📋 **Dashboard chauffeur** avec gestion des courses (Available/Active/Completed)
- ✅ **Workflow complet**: Accept → Pick Up → Deliver
- 🧭 **Navigation Google Maps** intégrée vers pickup/delivery
- 🔄 **Updates en temps réel** des statuts de livraison
- 📸 **Scanner QR** pour validation (à venir)
- 💰 **Calcul automatique** des revenus (80% du prix)

---

## 🏗️ Architecture Technique

### Stack Principal
- **Frontend**: Next.js 14.1.0 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM 5.20.0
- **Database**: PostgreSQL (Supabase Cloud)
- **Authentication**: NextAuth v4 avec Credentials Provider
- **Maps**: React Leaflet 4.2.1 (OpenStreetMap)
- **Icons**: Lucide React
- **Runtime**: Node.js v20.9.0

### Base de Données (Prisma Schema)
4 modèles principaux:
- **User**: Gestion des comptes (Client/Driver roles)
- **Driver**: Profil chauffeur avec véhicule et géolocalisation
- **Booking**: Réservations avec statuts (PENDING → ACCEPTED → PICKED_UP → DELIVERED)
- **Payment**: Transactions avec Stripe (préparé pour intégration)

### Sécurité
- 🔐 Mots de passe hashés avec **bcrypt**
- 🎫 Sessions JWT avec **NextAuth**
- 🛡️ Protection des routes API et pages (middleware)
- 🌐 Variables d'environnement pour secrets

---

## 📦 Installation Locale

### Prérequis
- Node.js v20+ 
- PostgreSQL (ou compte Supabase)
- Git

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/VOTRE_USERNAME/baggage-delivery-platform.git
cd baggage-delivery-platform
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
# Copier .env.example vers .env
cp .env.example .env

# Éditer .env avec vos valeurs:
# - DATABASE_URL: Votre connection string PostgreSQL
# - NEXTAUTH_SECRET: Générer avec: openssl rand -base64 32
# - NEXTAUTH_URL: http://localhost:3000
```

4. **Configurer la base de données**
```bash
npx prisma migrate deploy
npx prisma generate
```

5. **Seed les données de test (optionnel)**
```bash
npx ts-node scripts/seed.ts
```
Comptes créés:
- Client: `client@test.com` / `password123`
- Driver: `driver@test.com` / `password123`

6. **Lancer le serveur**
```bash
npm run dev
```

7. **Ouvrir l'application**
→ [http://localhost:3000](http://localhost:3000)

---

## 🚀 Déploiement Production

**Guide complet:** Voir [DEPLOYMENT.md](DEPLOYMENT.md)

**Résumé rapide:**
1. Push vers GitHub
2. Importer sur [Vercel](https://vercel.com)
3. Ajouter les variables d'environnement
4. Deploy automatique ✅

---

## 📁 Structure du Projet

```
/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # NextAuth handlers + signup
│   │   ├── bookings/          # CRUD réservations
│   │   ├── drivers/           # API chauffeurs
│   │   └── qrcode/            # Génération QR codes
│   ├── book/                  # Page de réservation
│   ├── dashboard/             # Dashboard client
│   ├── driver/                # Dashboard chauffeur
│   ├── login/                 # Page de connexion
│   ├── signup/                # Page d'inscription
│   └── page.tsx               # Landing page
├── components/
│   ├── AuthProvider.tsx       # Context NextAuth
│   ├── LanguageSelector.tsx   # Sélecteur de langue
│   └── Map.tsx                # Composant carte Leaflet
├── contexts/
│   └── LanguageContext.tsx    # Context i18n
├── lib/
│   ├── prisma.ts              # Client Prisma singleton
│   └── translations.ts        # Fichier de traductions (8 langues)
├── prisma/
│   ├── schema.prisma          # Schéma de la base de données
│   └── migrations/            # Migrations SQL
├── scripts/
│   └── seed.ts                # Script de seed
└── types/                     # Définitions TypeScript
```

---

## 🔌 Routes API

### Authentication
- `POST /api/auth/signup` - Créer un nouveau compte
- `POST /api/auth/signin` - Se connecter (géré par NextAuth)
- `POST /api/auth/signout` - Se déconnecter

### Bookings
- `GET /api/bookings` - Liste toutes les réservations (ou filtrées par customerId)
- `POST /api/bookings` - Créer une nouvelle réservation
- `GET /api/bookings/[id]` - Détails d'une réservation
- `PATCH /api/bookings/[id]` - Mettre à jour le statut (Accept/Pickup/Deliver)

### Drivers
- `GET /api/drivers` - Liste des chauffeurs disponibles
- `POST /api/drivers` - Enregistrer un nouveau chauffeur

### QR Code (préparé)
- `POST /api/qrcode` - Générer un QR code pour validation

---

## 🌐 Internationalisation (i18n)

**8 langues supportées:**
- 🇬🇧 English (EN)
- 🇫🇷 Français (FR)
- 🇩🇪 Deutsch (DE)
- 🇪🇸 Español (ES)
- 🇵🇹 Português (PT)
- 🇯🇵 日本語 (JA)
- 🇨🇳 中文 (ZH)
- 🇷🇺 Русский (RU)

**Implémentation:**
- Context API React pour gérer la langue
- localStorage pour persister le choix
- Composant LanguageSelector dans le header
- Fichier centralisé: `lib/translations.ts`

---

## 📊 Modèle de Données (Prisma)

### User
```prisma
- id, email, password (bcrypt), name, phone
- role: CLIENT | DRIVER
- emailVerified, createdAt, updatedAt
```

### Driver
```prisma
- userId (relation one-to-one)
- vehicleType, vehicleModel, licensePlate
- rating, totalDeliveries, earnings
- isVerified, isOnline
- latitude, longitude (position en temps réel)
```

### Booking
```prisma
- customerId, driverId (relations)
- pickupLocation, pickupLatitude, pickupLongitude
- deliveryLocation, deliveryLatitude, deliveryLongitude
- baggageSize (SMALL | MEDIUM | LARGE), baggageCount
- pickupTime, status (PENDING → ACCEPTED → PICKED_UP → DELIVERED)
- price, commission (20%), driverEarnings (80%)
- timestamps (createdAt, acceptedAt, pickedUpAt, deliveredAt)
```

### Payment
```prisma
- bookingId (relation)
- amount, status (PENDING | COMPLETED | FAILED)
- stripePaymentId (préparé pour intégration)
```

---

## 🎯 Workflow de Réservation

```
1. CLIENT crée réservation → Status: PENDING
   ↓
2. DRIVER accepte → Status: ACCEPTED (driverId assigné)
   ↓
3. DRIVER arrive et récupère → Status: PICKED_UP
   ↓
4. DRIVER livre au client → Status: DELIVERED
   ↓
5. Paiement automatique (80% driver, 20% commission)
```

---

## 🛣️ Roadmap

### ✅ Phase 1: MVP (Complété)
- [x] Frontend complet (Landing, Book, Dashboard client, Dashboard driver)
- [x] Authentification (NextAuth v4)
- [x] Base de données PostgreSQL + Prisma
- [x] API Routes CRUD
- [x] Support 8 langues
- [x] Intégration cartes (Leaflet/OpenStreetMap)
- [x] Déploiement production (Vercel)

### 🔄 Phase 2: Améliorations (En cours)
- [ ] Validation QR Code pour pickup/delivery
- [ ] Système de notation (reviews)
- [ ] Notifications en temps réel
- [ ] Upload photos des bagages
- [ ] Historique des courses

### 🚀 Phase 3: Features avancées (Futur)
- [ ] Intégration paiement Stripe
- [ ] Tracking GPS en temps réel
- [ ] Chat chauffeur-client
- [ ] Progressive Web App (PWA)
- [ ] Programme de fidélité
- [ ] API publique pour partenaires

---

## ⚙️ Scripts Disponibles

```bash
npm run dev          # Serveur de développement (port 3000)
npm run build        # Build production
npm run start        # Lancer le build de production
npm run lint         # Linter ESLint

npx prisma studio    # Interface graphique pour la DB
npx prisma migrate   # Créer/appliquer migrations
npx prisma generate  # Générer le client Prisma
```

---

## 🐛 Debugging

### Logs Prisma
```bash
# Activer les logs détaillés dans prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Build Errors
```bash
# Nettoyer le cache Next.js
rm -rf .next
npm run dev
```

### Database Issues
```bash
# Reset complet (⚠️ supprime toutes les données)
npx prisma migrate reset

# Re-seed
npx ts-node scripts/seed.ts
```

---

## 📱 Tests Manuels Recommandés

**Avant de déployer:**
1. ✅ Signup → Créer compte client
2. ✅ Login → Se connecter
3. ✅ Changer de langue → Vérifier traductions
4. ✅ Book → Créer réservation
5. ✅ Dashboard client → Voir la réservation
6. ✅ Logout → Login driver (driver@test.com)
7. ✅ Driver dashboard → Accepter réservation
8. ✅ Pick up → Marquer comme récupéré
9. ✅ Deliver → Marquer comme livré
10. ✅ Dashboard client → Vérifier statut "Delivered"

---

## 🎓 Points Techniques à Présenter

**Pour votre soutenance:**
- ✅ **Architecture cloud native**: Serverless (Vercel) + DBaaS (Supabase)
- ✅ **Full-stack TypeScript**: Type-safety front-to-back
- ✅ **ORM moderne**: Prisma avec migrations
- ✅ **Auth sécurisée**: JWT + bcrypt + NextAuth
- ✅ **API RESTful**: CRUD complet sur bookings
- ✅ **Responsive design**: Mobile-first avec Tailwind
- ✅ **Internationalisation**: 8 langues, context persistence
- ✅ **CI/CD automatique**: Git push → Auto-deploy Vercel
- ✅ **Géolocalisation**: Intégration maps + GPS navigation

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Guide](https://next-auth.js.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [React Leaflet Guide](https://react-leaflet.js.org/)

---

## 📄 Licence

Projet académique - M2 Sorbonne - Cloud Computing 2026

---

## 👤 Auteur

Projet développé dans le cadre du cours Cloud Computing

**Contact pour démo:** [Votre email]

---

**🎒 BagExpress** - Voyagez léger, on s'occupe du reste ! ✈️

