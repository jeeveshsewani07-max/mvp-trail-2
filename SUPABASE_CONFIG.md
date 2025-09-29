# Supabase Configuration for Vercel Deployment

## 🚨 CRITICAL: Configure These Settings in Supabase Dashboard

To fix the "failed to fetch" error on Vercel, you MUST configure the following settings in your Supabase project:

### 1. **Authentication Settings**

Go to: **Supabase Dashboard** → **Authentication** → **Settings**

#### Site URL:
```
https://your-app-name.vercel.app
```

#### Additional Redirect URLs:
Add BOTH of these URLs:
```
http://localhost:3000/auth/callback
https://your-app-name.vercel.app/auth/callback
```

### 2. **Auth Providers (if using Google OAuth)**

Go to: **Authentication** → **Providers** → **Google**

- **Enabled**: ✅ Yes
- **Client ID**: Your Google OAuth Client ID
- **Client Secret**: Your Google OAuth Client Secret
- **Redirect URL**: 
  ```
  https://your-project-id.supabase.co/auth/v1/callback
  ```

### 3. **CORS Settings**

Go to: **Settings** → **API**

#### Allowed Origins:
Add these domains:
```
http://localhost:3000
https://your-app-name.vercel.app
https://*.vercel.app
```

### 4. **Environment Variables on Vercel**

Set these in: **Vercel Dashboard** → **Project Settings** → **Environment Variables**

```bash
# Required for both Development and Production
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL for auth redirects
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
NEXTAUTH_URL=https://your-app-name.vercel.app

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth Secret
NEXTAUTH_SECRET=your-secure-random-secret
```

### 5. **Google OAuth Console (if using Google sign-in)**

Go to: **Google Cloud Console** → **APIs & Services** → **Credentials**

#### Authorized JavaScript Origins:
```
http://localhost:3000
https://your-app-name.vercel.app
```

#### Authorized Redirect URIs:
```
https://your-project-id.supabase.co/auth/v1/callback
https://your-app-name.vercel.app/auth/callback
```

## 🔧 **Code Changes Applied**

The following fixes have been implemented in your code:

1. **Dynamic URL Resolution**: Auth redirects now work in both development and production
2. **Environment Variable Handling**: Proper fallbacks for missing environment variables
3. **Vercel URL Detection**: Automatic detection of Vercel deployment URLs
4. **Robust Error Handling**: Better error messages and debugging

## ✅ **Testing Steps**

After configuring the above settings:

1. **Deploy to Vercel** (push your changes)
2. **Update Supabase Settings** with your actual Vercel URL
3. **Test Magic Link**: Try signing up with email
4. **Test Google OAuth**: Try Google sign-in (if configured)
5. **Check Network Tab**: Look for CORS or 403 errors if still failing

## 🚨 **Common Issues**

| Error | Cause | Solution |
|-------|-------|----------|
| `failed to fetch` | CORS/Domain not allowed | Add Vercel URL to Supabase allowed origins |
| `Invalid redirect URL` | Redirect URL not configured | Add callback URL to Supabase auth settings |
| `OAuth error` | Google OAuth misconfigured | Update Google Console with correct URLs |
| `Environment variable missing` | Vercel env vars not set | Set all required environment variables |

## 🎯 **Next Steps**

1. **Update the site URL** in this file with your actual Vercel deployment URL
2. **Configure Supabase** with the URLs above
3. **Test the deployment** - magic links should now work on Vercel!
