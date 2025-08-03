# 🔧 Environment Variables Setup Guide

## 📁 Create .env File

Create a file named `.env` in your project root directory (same level as package.json):

```
ChickHub/
├── src/
├── public/
├── package.json
├── .env  ← Create this file here
└── README.md
```

## 📝 .env File Content

Copy this template and replace with your actual Supabase values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here
```

## 🔑 How to Get Your Keys

### 1. Supabase Project URL
- Format: `https://[project-id].supabase.co`
- Example: `https://abcd1234efgh5678.supabase.co`

### 2. Anon Key (Public Key)
- Go to Supabase Dashboard → Settings → API
- Copy the "anon public" key
- Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Service Role Key (Private Key)
- Same location: Settings → API
- Copy the "service_role" key
- Also starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ⚠️ Important Notes

- **Never commit .env to git** (it's already in .gitignore)
- **Restart your dev server** after creating .env file
- **Use VITE_ prefix** for Vite to recognize the variables
- **Keep service role key secure** - it has admin access

## ✅ Verify Setup

After creating .env file, test in browser console:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should show your Supabase URL
```

## 🔄 Restart Required

After creating or modifying .env:
1. Stop your dev server (Ctrl+C)
2. Run `npm run dev` again
3. Environment variables will be loaded