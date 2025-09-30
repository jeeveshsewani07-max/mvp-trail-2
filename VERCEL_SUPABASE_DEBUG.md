# 🔍 VERCEL-SUPABASE CONNECTION DEBUG GUIDE

## **THE PROBLEM:**
- ✅ **Supabase Database**: Working perfectly, tables created, data accessible
- ✅ **Local Development**: Connects to Supabase without issues  
- ❌ **Vercel Production**: Cannot fetch from Supabase database

## **ROOT CAUSES & SOLUTIONS:**

---

## 🚨 **MOST LIKELY CAUSE: Environment Variables**

### **Issue: Vercel Environment Variables Not Set**

**Symptoms:**
- Local works, Vercel fails
- "Connection refused" or "Authentication failed" errors
- Empty responses from Supabase queries

**Solution:**
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **CRITICAL**: Set these EXACTLY as shown:

```bash
# Required Environment Variables (Set for ALL environments)
NEXT_PUBLIC_SUPABASE_URL=https://nlnqupvckrvyinabvegg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sbnF1cHZja3J2eWluYWJ2ZWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MTMwMjEsImV4cCI6MjA3NDM4OTAyMX0.-sp88T8eKQ8wgTius4FboyLRxsXc8wwDXV5RHiiVzJOw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sbnF1cHZja3J2eWluYWJ2ZWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgxMzAyMSwiZXhwIjoyMDc0Mzg5MDIxfQ.Yly-QVEjoXpGcKSr3XN3QU2L82F15bhvZbr_jEX9dUc

# NextAuth (if using)
NEXTAUTH_SECRET=your-random-secret-32-chars-or-more
NEXTAUTH_URL=https://your-vercel-app.vercel.app

# Google OAuth (if using)  
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**⚠️ CRITICAL CHECKLIST:**
- [ ] Variables set for **"All environments"** (not just Production)
- [ ] No extra spaces before/after values
- [ ] No quotes around the values (Vercel adds them automatically)
- [ ] Values match your local `.env.local` file exactly

---

## 🔧 **IMMEDIATE DIAGNOSTIC STEPS:**

### **Step 1: Test Your Diagnostic Endpoint**
Visit this URL once your latest deployment completes:
```
https://your-vercel-app.vercel.app/api/test-supabase
```

**What to look for:**
```json
{
  "tests": [
    {
      "test": "Environment Variables",
      "supabase_url": {
        "exists": false,  // ❌ This is likely your problem!
        "value": "MISSING"
      }
    }
  ]
}
```

### **Step 2: Check Vercel Build Logs**
1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on latest deployment
3. Click **"View Function Logs"**
4. Look for environment variable errors

### **Step 3: Manual Environment Check**
Add this temporary diagnostic to any API route:
```javascript
console.log('ENV CHECK:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30),
  service: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30)
});
```

---

## 🎯 **OTHER POTENTIAL CAUSES:**

### **Cause #2: Supabase RLS (Row Level Security) Policies**

**Symptoms:**
- Connection works but queries return empty results
- "Insufficient permissions" errors

**Solution:**
1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Check `student_profiles` table policies
3. Ensure policies allow authenticated users to read/write

**Quick RLS Check:**
```sql
-- Temporarily disable RLS for testing (re-enable after!)
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;
```

### **Cause #3: Supabase API Limits**

**Symptoms:**
- Works sometimes, fails other times
- "Too many requests" errors

**Solution:**
1. Check **Supabase Dashboard** → **Settings** → **Usage**
2. Verify you haven't hit API limits
3. Upgrade plan if necessary

### **Cause #4: Network/CORS Issues**

**Symptoms:**
- CORS errors in browser console
- "Network request failed" errors

**Solution:**
1. Go to **Supabase Dashboard** → **Settings** → **API**  
2. Add your Vercel URL to allowed origins:
   ```
   https://your-vercel-app.vercel.app
   https://*.vercel.app
   ```

---

## 🔍 **DEBUGGING WORKFLOW:**

### **Phase 1: Environment Variables**
1. ✅ Set environment variables in Vercel Dashboard
2. ✅ Redeploy (trigger new build)
3. ✅ Test diagnostic endpoint
4. ❌ If still failing → Go to Phase 2

### **Phase 2: Authentication & Permissions**
1. ✅ Check Supabase RLS policies
2. ✅ Test with RLS temporarily disabled
3. ✅ Verify user authentication flow
4. ❌ If still failing → Go to Phase 3

### **Phase 3: Network & Configuration**
1. ✅ Check Supabase CORS settings
2. ✅ Verify Supabase project status (not paused)
3. ✅ Check API usage limits
4. ✅ Test direct Supabase connection from Vercel

---

## 📊 **DIAGNOSTIC ENDPOINTS AVAILABLE:**

| Endpoint | Purpose | What It Tests |
|----------|---------|---------------|
| `/api/test-supabase` | Complete diagnostic | Environment vars, connection, tables, auth |
| `/api/debug/vercel-connection` | Vercel-specific | Vercel environment and Supabase connectivity |
| `/api/storage/health` | Storage test | Supabase storage connectivity |

---

## 🚀 **QUICK FIX CHECKLIST:**

**Try these in order:**

1. **[ ] Set Environment Variables** in Vercel Dashboard
   - Most common cause (90% of cases)
   
2. **[ ] Redeploy** after setting environment variables
   - Environment changes require new deployment
   
3. **[ ] Test Diagnostic Endpoint** 
   - Confirms which specific component is failing
   
4. **[ ] Check Supabase Dashboard**
   - Ensure project is active and not paused
   
5. **[ ] Add Vercel Domain to Supabase**
   - CORS and authentication settings

---

## 💡 **EMERGENCY WORKAROUND:**

If you need a quick test, temporarily add this to your API route:
```javascript
// Emergency debug - remove after testing
console.log('SUPABASE CONNECTION TEST:', {
  url_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  url_value: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key_exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  key_length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
});
```

This will show in Vercel function logs exactly what environment variables are available.

---

## 🎯 **NEXT STEPS:**

1. **Check your Vercel Dashboard** for environment variables
2. **Test the diagnostic endpoint** once deployment completes  
3. **Report back the results** - I can provide specific solutions based on what the diagnostic shows

The diagnostic endpoints will tell us exactly where the connection is failing!
