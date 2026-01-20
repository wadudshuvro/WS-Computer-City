# 🗄️ Database Setup Guide

Your product entry form needs a database with categories and brands. Here are your options:

---

## ✅ Option 1: Install PostgreSQL Locally (Recommended for Development)

### **Download & Install:**
1. Go to: https://www.postgresql.org/download/windows/
2. Download PostgreSQL installer (latest version)
3. Run installer with these settings:
   - Password: `postgres` (or remember what you set)
   - Port: `5432` (default)
   - Install all components

### **After Installation:**
1. PostgreSQL should start automatically
2. If not, open Services (`Win + R` → `services.msc`)
3. Find "postgresql-x64-XX" → Right-click → Start

### **Configure Your Project:**
1. Create a `.env` file in your project root:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ws_computer_city?schema=public"
```

2. Run these commands:
```bash
npm run db:push
npm run db:seed
```

3. Refresh your browser - categories and brands should now appear!

---

## ✅ Option 2: Use Docker (If You Have Docker Installed)

### **Start PostgreSQL Container:**
```bash
docker run --name ws-postgres ^
  -e POSTGRES_PASSWORD=postgres ^
  -e POSTGRES_DB=ws_computer_city ^
  -p 5432:5432 ^
  -d postgres:15
```

### **Configure Your Project:**
1. Create `.env` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ws_computer_city?schema=public"
```

2. Run these commands:
```bash
npm run db:push
npm run db:seed
```

---

## ✅ Option 3: Use Free Cloud Database (Easiest - No Installation!)

### **Supabase (Free PostgreSQL):**

1. **Sign up:** https://supabase.com (free account)

2. **Create New Project:**
   - Project name: `ws-computer-city`
   - Database password: (create a strong password)
   - Region: Choose closest to you

3. **Get Connection String:**
   - Go to Project Settings → Database
   - Copy "Connection string" (Direct connection / Session mode)
   - Replace `[YOUR-PASSWORD]` with your password

4. **Configure Your Project:**
   - Create `.env` file with your connection string:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

5. **Run Setup:**
```bash
npm run db:push
npm run db:seed
```

---

## ✅ Option 4: Use Neon (Another Free Cloud Option)

### **Neon (Free PostgreSQL):**

1. **Sign up:** https://neon.tech (free account)

2. **Create Project:**
   - Project name: `ws-computer-city`
   - Copy the connection string

3. **Configure:**
   - Create `.env` with the connection string

4. **Run Setup:**
```bash
npm run db:push
npm run db:seed
```

---

## 🧪 Verify It's Working:

After setting up any option above:

1. **Check categories:**
   - Open: http://localhost:3000/api/admin/categories
   - You should see JSON with categories

2. **Check brands:**
   - Open: http://localhost:3000/api/admin/brands
   - You should see JSON with brands

3. **Go back to product form:**
   - http://localhost:3000/admin/products/new
   - Dropdowns should now be populated!

---

## 🎯 What Gets Seeded:

After running `npm run db:seed`, you'll have:

### **Categories:**
- Desktop PC
- Components
  - Processor
  - Graphics Card
  - SSD
  - RAM
- Laptop

### **Brands:**
- Intel
- AMD
- NVIDIA
- Samsung
- ASUS

### **Specification Definitions:**
- Processor specs (Socket, Cores, Threads, Clock Speed, Cache, TDP)
- GPU specs (Chipset, Memory Size, Memory Type)
- SSD specs (Capacity, Interface, Read Speed)
- RAM specs (Capacity, Type, Speed)

### **Sample Products:**
- Intel Core i5-12400F
- AMD Ryzen 5 5600X

---

## ❓ Still Having Issues?

### **Error: "Can't reach database server"**
→ Database server isn't running. Start PostgreSQL service or use cloud option.

### **Error: "Password authentication failed"**
→ Check your DATABASE_URL password matches your PostgreSQL password.

### **Error: "database does not exist"**
→ Create the database manually or use cloud option (auto-creates).

### **Dropdowns still empty?**
→ Run `npm run db:seed` again and refresh the page.

---

## 🚀 Quick Start (5 Minutes with Cloud DB):

1. Sign up for Supabase (https://supabase.com)
2. Create project, get connection string
3. Create `.env` file with `DATABASE_URL="..."`
4. Run `npm run db:push && npm run db:seed`
5. Refresh product form - done!

---

**Choose the option that works best for you and follow the steps. The cloud options (Supabase/Neon) are fastest if you don't want to install anything locally!**
