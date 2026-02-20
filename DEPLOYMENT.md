# 🚀 Guide de Déploiement

## Étape 1: Créer un Repository GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur **"New repository"** (bouton vert)
3. Nommez-le: `baggage-delivery-platform` (ou un nom de votre choix)
4. **NE PAS** cocher "Initialize with README" (vous en avez déjà un)
5. Cliquez sur **"Create repository"**

6. Dans votre terminal (ici), exécutez:
```powershell
git remote add origin https://github.com/VOTRE_USERNAME/baggage-delivery-platform.git
git branch -M main
git push -u origin main
```
*(Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub)*

---

## Étape 2: Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** ou **"Login"**
3. Choisissez **"Continue with GitHub"**
4. Une fois connecté, cliquez sur **"Add New"** → **"Project"**
5. **Importez votre repository** `baggage-delivery-platform`
6. Vercel va détecter automatiquement Next.js ✅

### Configuration des Variables d'Environnement

**IMPORTANT:** Avant de cliquer "Deploy", ajoutez ces 3 variables:

1. Cliquez sur **"Environment Variables"**
2. Ajoutez une par une:

**Variable 1:**
- Name: `DATABASE_URL`
- Value: `postgresql://postgres.xosasbhuhkejwuhxfrqr:I7bB%235Wet1MvF6M6@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`

**Variable 2:**
- Name: `NEXTAUTH_SECRET`
- Value: Copiez la valeur depuis votre fichier `.env` local

**Variable 3:**
- Name: `NEXTAUTH_URL`
- Value: Laissez vide pour l'instant, ou mettez `https://votre-projet.vercel.app`
  *(Vercel va automatiquement utiliser l'URL du déploiement)*

3. Cliquez sur **"Deploy"** 🚀

---

## Étape 3: Après le Déploiement

1. **Attendez 2-3 minutes** que Vercel build votre projet
2. Vous verrez "🎉 Congratulations!" quand c'est terminé
3. Cliquez sur **"Visit"** ou copiez l'URL (format: `https://votre-projet.vercel.app`)

### Mise à jour de NEXTAUTH_URL (si nécessaire)

1. Dans Vercel, allez dans **Settings** → **Environment Variables**
2. Trouvez `NEXTAUTH_URL`
3. Changez la valeur pour votre vraie URL: `https://votre-projet.vercel.app`
4. Cliquez sur **"Save"**
5. Allez dans **Deployments** → cliquez sur les 3 points de votre dernier déploiement → **"Redeploy"**

---

## ✅ Vérifications Post-Déploiement

Testez votre application en ligne:

1. **Page d'accueil** → Changement de langue fonctionne?
2. **Signup** → Créer un compte client
3. **Login** → Se connecter
4. **Book** → Créer une réservation
5. **Dashboard** → Voir la réservation
6. **Login** en tant que driver (driver@test.com / password123)
7. **Driver Dashboard** → Accepter, récupérer, livrer

---

## 🔄 Déploiements Futurs

Chaque fois que vous faites un changement:

```powershell
git add .
git commit -m "Description de vos changements"
git push
```

→ Vercel **redéploie automatiquement** ! 🎉

---

## 📱 Partager votre Projet

Votre URL de production:
- Format: `https://votre-projet.vercel.app`
- Partagez-la avec vos profs/collègues
- Ajoutez-la dans votre rapport de projet

---

## 🆘 En cas de Problème

**Build Failed?**
- Vérifiez les logs dans Vercel
- Assurez-vous que `DATABASE_URL` est correcte
- Vérifiez que Prisma generate s'exécute bien (normalement automatique)

**500 Error?**
- Vérifiez les variables d'environnement
- Regardez les logs: Vercel Dashboard → votre projet → **Functions** → cliquez sur une fonction pour voir les logs

**Database Connection Error?**
- Vérifiez que votre URL Supabase utilise bien le **Session Pooler** (port 5432)
- Vérifiez que votre base Supabase est bien accessible publiquement

---

## 🎓 Pour votre Présentation

Points à mentionner:
- ✅ Application full-stack déployée en production
- ✅ Architecture cloud: Next.js (Vercel) + PostgreSQL (Supabase)
- ✅ CI/CD automatique (GitHub → Vercel)
- ✅ 8 langues supportées
- ✅ Authentification sécurisée
- ✅ Base de données relationnelle avec ORM
- ✅ API RESTful
- ✅ Responsive design

**Démonstration live:** Ouvrez l'URL Vercel pendant votre présentation! 🎯
