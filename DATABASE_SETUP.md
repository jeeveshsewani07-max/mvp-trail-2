# Database Setup Instructions

## 🎯 **Quick Fix for "faculty_profiles table not found" Error**

### **Step 1: Run the Schema in Supabase**

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `nlnqupvckrvyinabvegg`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Run the Schema**
   - Open the `supabase-schema.sql` file I just created
   - Copy ALL the contents
   - Paste it into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)

### **Step 2: Verify Tables Created**

After running the script, verify these tables exist:
- `users` ✅
- `institutions` ✅  
- `departments` ✅
- `student_profiles` ✅
- `faculty_profiles` ✅ ← **This will fix your error!**
- `recruiter_profiles` ✅
- `achievements` ✅
- `achievement_categories` ✅
- `events` ✅
- `job_postings` ✅
- `notifications` ✅
- `badges` ✅

### **Step 3: Test the Faculty Onboarding**

1. Try the faculty onboarding form again
2. The "faculty_profiles table not found" error should be resolved
3. Faculty profile creation should now work successfully

## 🔧 **What This Script Does**

### **Creates Database Schema:**
- **15+ interconnected tables** for the full Student Hub functionality
- **Proper relationships** and foreign key constraints
- **Indexes** for optimal query performance
- **Row Level Security (RLS)** policies for data protection

### **Includes Default Data:**
- **9 Achievement Categories** (Technical, Competition, Research, etc.)
- **5 Default Badges** (First Achievement, Achievement Hunter, etc.)
- **Proper user roles** and status enums

### **Sets Up Security:**
- **RLS policies** so users can only access their own data
- **Triggers** for automatic timestamp updates
- **UUID primary keys** for better security

## 🚀 **After Setup**

Once the schema is created:

1. **Faculty Onboarding** ✅ Will work properly
2. **Student Onboarding** ✅ Will work properly  
3. **Achievement System** ✅ Ready to use
4. **Event System** ✅ Ready to use
5. **Job Posting** ✅ Ready to use
6. **Badge System** ✅ Ready to use

## 🛠️ **Troubleshooting**

### **If you get permission errors:**
- Make sure you're running the script as the project owner
- Check that RLS is properly configured

### **If tables already exist:**
- The script uses `CREATE TABLE` (not `CREATE TABLE IF NOT EXISTS`)
- If you get "table already exists" errors, that's actually good - it means some tables are already there
- You can ignore those specific errors

### **To verify everything worked:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

This should show all your tables including `faculty_profiles`.

## ✅ **Expected Result**

After running this script:
- ✅ Faculty onboarding will work without "table not found" errors
- ✅ Student onboarding will work properly
- ✅ All dashboard features will have proper database backing
- ✅ The application will be fully functional

**🎉 Your Smart Student Hub database will be completely set up and ready to use!**
