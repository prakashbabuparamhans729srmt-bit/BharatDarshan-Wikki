# BharatDarshan Wiki - India's Digital Encyclopedia

A-Z Advanced Heritage Wiki for every state and district in India. Built with Next.js, Firebase, and Genkit AI.

## GitHub par Push karne ke Sahi Commands:

Aapko placeholders (`<..._USERNAME>`) ko apni asli details se badalna hoga:

1. **Git Initialise karein:**
   ```bash
   git init
   ```

2. **Files add karein:**
   ```bash
   git add .
   ```

3. **Commit karein:**
   ```bash
   git commit -m "Initial commit: BharatDarshan Wiki A-Z Advance"
   ```

4. **Main branch set karein:**
   ```bash
   git branch -M main
   ```

5. **Remote Repository link karein:**
   Pehle GitHub par ek repository banayein, phir uska URL yahan paste karein. 
   **Dhayan dein:** `YOUR_USERNAME` ki jagah apna username likhein.
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

6. **GitHub par Push karein:**
   ```bash
   git push -u origin main
   ```

---

## ⚠️ Password Maang raha hai? (Token Kaise Banayein)

GitHub ab account password nahi leta. Jab terminal password maange, toh aapko **Personal Access Token (PAT)** paste karna hoga:

1. **GitHub Website** par jayein.
2. **Settings** -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)** par click karein.
3. **Generate new token (classic)** par click karein.
4. Note mein kuch bhi likh dein (jaise: `my-token`).
5. Expiration mein `No expiration` ya `30 days` select karein.
6. **Select Scopes:** `repo` wale checkbox ko tik karein.
7. Sabse niche **Generate token** par click karein.
8. **Token copy karein** (Ye sirf ek baar dikhega!).
9. Terminal mein jab **Password** maange, toh yahi token paste kar dein (Paste karte waqt password dikhega nahi, bas Enter daba dein).

## Tech Stack:
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn UI
- **Backend:** Firebase (Auth, Firestore)
- **AI:** Genkit (Gemini 2.5 Flash)
- **Icons:** Lucide-React
