# 🚀 Supabase Setup Instructions

You've successfully created a Supabase project! Now let's connect it.

## 📋 Step 1: Get Your Connection String

### Option A: From the Connect Dialog (Current Page)
1. In the Supabase dialog you have open
2. Look for the **"Connection String"** tab (next to "Session pooler")
3. Select **"URI"** format
4. Copy the full connection string

### Option B: From Project Settings
1. Go to **Project Settings** (⚙️ gear icon in bottom left)
2. Click **Database** in the sidebar
3. Scroll down to **"Connection string"** section
4. Copy the **"Connection string"** (URI format)

Your connection string should look like:
```
postgresql://postgres.ymnsxjythtjdvzolkymb:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

**⚠️ Important:** Replace `[YOUR-PASSWORD]` with your actual database password (the one you set when creating the project)

---

## 📝 Step 2: Create .env File

Create a new file named **`.env`** in your project root folder with this content:

```env
# Database Connection (Supabase)
DATABASE_URL="postgresql://postgres.ymnsxjythtjdvzolkymb:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

**Replace** `[YOUR-PASSWORD]` with your actual Supabase password!

---

## 🔧 Step 3: Setup Database Schema & Seed Data

Open your terminal and run these commands:

```bash
# Generate Prisma Client
npm run db:generate

# Push database schema to Supabase
npm run db:push

# Seed the database with categories, brands, and sample data
npm run db:seed
```

You should see output like:
```
✅ Database connected
✅ Admin user created: admin@wscomputercity.com
✅ Brands created: 5
✅ Categories created
✅ All specification definitions created
✅ Sample products created: 2
🎉 Database seeded successfully!
```

---

## ✅ Step 4: Verify It Works

1. **Refresh your browser** on the product form page
2. The **Category** and **Brand** dropdowns should now be populated!
3. Try selecting a category to see dynamic specifications load

---

## 🎯 What You'll Have After Seeding:

### Categories:
- Desktop PC
- Components
  - Processor ✅ (with dynamic specs)
  - Graphics Card ✅ (with dynamic specs)
  - SSD ✅ (with dynamic specs)
  - RAM ✅ (with dynamic specs)
- Laptop

### Brands:
- Intel
- AMD
- NVIDIA
- Samsung
- ASUS

### Admin Login:
- **Email:** admin@wscomputercity.com
- **Password:** admin123

### Sample Products:
- Intel Core i5-12400F (with full specifications)
- AMD Ryzen 5 5600X (with full specifications)

---

## 🔍 Troubleshooting

### Error: "Can't reach database server"
→ Check your DATABASE_URL password is correct (no brackets around it!)

### Error: "Prepared statement already exists"
→ Your database might already be set up. Try just running `npm run db:seed`

### Dropdowns still empty after seeding?
→ Hard refresh the page (Ctrl+Shift+R) or clear browser cache

### Want to reset everything?
1. Go to Supabase Dashboard → Table Editor
2. Delete all tables
3. Run `npm run db:push && npm run db:seed` again

---

## 🎉 You're All Set!

Once the seed completes:
1. Go to: http://localhost:3000/admin/products/new
2. Categories and brands will be in the dropdowns
3. Select "Processor" category to see dynamic specifications appear!
4. Start adding your products! 🚀
