# Remote Job Platform - Production Architecture

## 🎯 SYSTEM OVERVIEW
Mobile-first remote job discovery platform for underserved markets with dual-location filtering (Applicant Country + Hiring Countries).

## 📊 TECHNOLOGY STACK
- **Mobile**: React Native + Expo (Android-optimized)
- **Web Admin**: React + Next.js
- **Backend**: Node.js API Routes
- **Database**: PostgreSQL 17
- **Auth**: Email/Password + Google OAuth
- **Payments**: Stripe Subscriptions
- **Search**: PostgreSQL Full-Text Search (GIN indexes)
- **Notifications**: Expo Push Notifications

## 🗄️ DATABASE SCHEMA

### Users Table (auth_users - extended)
- applicant_country: text (ISO code)
- preferred_categories: text[]
- experience_level: text
- employment_types: text[]
- user_timezone: text
- is_premium: boolean
- premium_expires_at: timestamp
- stripe_id: text
- subscription_status: text
- saved_jobs_count: integer (default 0)
- active_alerts_count: integer (default 0)
- has_completed_onboarding: boolean

### Companies
- id, name, slug, logo_url, description
- website, remote_policy
- hiring_countries: text[]
- created_at, updated_at

### Jobs
- id, company_id, title, category
- experience_level, employment_type
- applicant_countries_allowed: text[] (empty = worldwide)
- hiring_countries: text[]
- salary_min, salary_max, salary_currency
- description, responsibilities: text[]
- requirements: text[], benefits: text[]
- timezone_compatibility: text[]
- apply_url, source
- posted_at, expires_at, is_active
- dedup_hash (unique)
- view_count, apply_count
- search_vector (tsvector)

### Saved Jobs & Searches
- User saved jobs (max 5 free, unlimited premium)
- Saved searches with alert frequency
- Job reports

## 💰 MONETIZATION
**Free**: 5 saved jobs, 2 alerts, banner ads
**Premium ($9.99/mo)**: Unlimited saves/alerts, no ads, 12h early access, export CSV

## 📱 SCREENS
**Mobile**: Splash, Onboarding (5 steps), Login/Signup, Home Feed, Filters, Job Details, Company Directory, Saved, Premium, Settings
**Web Admin**: Dashboard, Jobs CRUD, Companies, Reports, Analytics

## 🚀 30-DAY MVP PLAN
Week 1: Database + Auth + API
Week 2: Mobile UI + Core Features
Week 3: Premium + Alerts + Ads
Week 4: Admin Panel + Testing + Launch
