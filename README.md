# BagExpress - Plateforme de Livraison de Bagages

BagExpress est une plateforme cloud permettant de connecter des voyageurs avec des chauffeurs pour la livraison de leurs bagages. Voyagez léger, on s'occupe du reste !

## 🚀 Fonctionnalités

### Pour les utilisateurs
- ✅ Réservation en ligne avec formulaire intuitif
- 🗺️ Carte interactive pour visualiser le trajet
- 💳 Paiement sécurisé intégré
- 📍 Suivi GPS en temps réel
- 🔒 Assurance incluse (1000€)
- 📱 Interface responsive (mobile-friendly)

### Pour les chauffeurs
- 📋 Dashboard avec liste des courses disponibles
- ✅ Acceptation rapide des livraisons
- 🧭 Navigation GPS intégrée
- 📸 Scanner QR code pour validation
- 💰 Suivi des gains en temps réel

## 🛠️ Technologies utilisées

- **Framework**: Next.js 14 (React)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **Cartes**: React Leaflet (OpenStreetMap)
- **Icons**: Lucide React
- **QR Codes**: qrcode library

## 📦 Installation

1. Clonez le repository ou installez les dépendances :

```bash
npm install
```

2. Lancez le serveur de développement :

```bash
npm run dev
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 Structure du projet

```
Web project/
├── app/
│   ├── page.tsx              # Page d'accueil
│   ├── book/page.tsx         # Interface de réservation
│   ├── driver/page.tsx       # Dashboard chauffeur
│   ├── layout.tsx            # Layout principal
│   ├── globals.css           # Styles globaux
│   └── api/                  # Routes API
│       ├── bookings/         # Gestion des réservations
│       ├── drivers/          # Gestion des chauffeurs
│       └── qrcode/           # Génération QR codes
├── components/
│   └── Map.tsx               # Composant carte interactive
├── types/
│   └── index.ts              # Types TypeScript
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🎯 Pages principales

### 1. Page d'accueil (`/`)
- Hero section avec CTA
- Présentation des fonctionnalités
- Guide "Comment ça marche"
- Footer avec liens utiles

### 2. Réservation (`/book`)
- Formulaire en 3 étapes :
  1. Itinéraire (récupération → livraison)
  2. Détails (taille bagage, quantité, horaire)
  3. Paiement
- Carte interactive avec trajet
- Résumé en temps réel du prix

### 3. Dashboard Chauffeur (`/driver`)
- 3 onglets : Disponibles / En cours / Complétées
- Acceptation des courses
- Navigation GPS intégrée
- Scanner QR pour validation
- Suivi des gains

## 🔧 API Routes

### Bookings
- `GET /api/bookings` - Liste des réservations
- `POST /api/bookings` - Créer une réservation
- `GET /api/bookings/[id]` - Détails d'une réservation
- `PATCH /api/bookings/[id]` - Mettre à jour une réservation

### Drivers
- `GET /api/drivers` - Liste des chauffeurs
- `POST /api/drivers` - Enregistrer un chauffeur

### QR Code
- `POST /api/qrcode` - Générer un QR code

## 🎨 Design System

### Couleurs principales
- Primary: Blue (Tailwind primary-*)
- Success: Green
- Warning: Yellow
- Error: Red

### Composants réutilisables
- Boutons avec états hover
- Cards avec shadow
- Formulaires avec validation
- Modals
- Tabs navigation

## 🚀 Prochaines étapes

### Fonctionnalités à ajouter
1. **Backend complet**
   - Base de données PostgreSQL
   - Prisma ORM
   - Authentification (NextAuth.js)

2. **Paiements**
   - Intégration Stripe
   - Gestion des paiements escrow

3. **Temps réel**
   - Socket.io pour tracking GPS
   - Notifications push

4. **Mobile**
   - Progressive Web App (PWA)
   - Apps natives (React Native)

5. **Fonctionnalités avancées**
   - Système de notation
   - Chat intégré
   - Historique des courses
   - Programme de fidélité

## 📄 Licence

Projet académique - M2 Sorbonne - Cloud Computing 2026

## 👥 Équipe

Projet développé dans le cadre du cours Cloud Computing

---

**BagExpress** - Voyagez léger, on s'occupe du reste ! 🎒✈️
