# Smart Student Hub - MVP

🎓 **A comprehensive platform for verified student digital identities, achievements, and career opportunities.**

## Overview

Smart Student Hub is a production-ready MVP that provides students with a verified digital portfolio, connects them with opportunities, and enables institutions to track student progress effectively.

## ✨ Key Features

### 🎯 **For Students**
- **Verified Digital Portfolio** - Build and showcase verified achievements
- **Job & Internship Discovery** - Find opportunities matched to your skills
- **Event Participation** - Join events and earn credits automatically  
- **Achievement Tracking** - Upload and get faculty-approved achievements
- **Dynamic Resume Generation** - Export professional resumes instantly
- **Skills-based Matching** - Get personalized job recommendations

### 👨‍🏫 **For Faculty & Mentors**
- **One-click Approvals** - Review and approve student achievements quickly
- **Event Management** - Create and manage institutional events
- **Mentee Dashboard** - Track and guide student progress
- **Bulk Actions** - Approve multiple achievements efficiently
- **Analytics Dashboard** - Monitor student engagement and growth

### 💼 **For Recruiters**
- **Verified Candidate Profiles** - Access students with verified skills
- **Job Posting Platform** - Post jobs and internships with smart filtering
- **Application Management** - Track and manage candidate applications
- **Skills-based Search** - Find candidates by specific competencies
- **Direct Communication** - Connect with high-potential students

### 🏛️ **For Institutions**
- **Comprehensive Analytics** - NAAC/NIRF-ready institutional reports
- **Department Management** - Track performance across departments
- **Custom Credit Systems** - Define institution-specific credit values
- **Event Oversight** - Monitor all campus activities and participation
- **Compliance Reporting** - Generate reports for accreditation bodies

## 🚀 Tech Stack

### **Frontend & Framework**
- **Next.js 14** with App Router and TypeScript
- **TailwindCSS** + **shadcn/ui** for beautiful, accessible UI
- **Framer Motion** for smooth animations
- **React Hook Form** + **Zod** for type-safe form validation

### **Backend & Database**
- **Supabase** for authentication, real-time database, and storage
- **Drizzle ORM** with PostgreSQL for type-safe database operations
- **Server Components** for optimal performance
- **Real-time subscriptions** for live notifications

### **Authentication & Security**
- **Magic Link Authentication** - Passwordless login
- **Google OAuth** integration
- **Role-based Access Control** - Student, Faculty, Recruiter, Institution Admin
- **Row Level Security** with Supabase policies

### **Developer Experience**
- **TypeScript** end-to-end for type safety
- **ESLint** + **Prettier** for code quality
- **Husky** + **lint-staged** for pre-commit hooks
- **Vitest** + **Testing Library** for unit tests
- **Playwright** for end-to-end testing

## 🏗️ Architecture

### **Database Schema**
- **15+ interconnected tables** covering all features
- **Proper relationships and indexing** for optimal performance
- **Support for achievements, events, jobs, notifications, badges**
- **Analytics and reporting structure** built-in

### **Key Components**
- **Role-based Dashboards** for different user types
- **Achievement Upload & Approval System** with file handling
- **Event Creation & Management** with credit allocation
- **Job Posting & Application System** with matching algorithms
- **Real-time Notification System** with multiple delivery channels
- **Portfolio Generation** with QR codes and verification

## 📋 Getting Started

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Supabase account (free tier sufficient)
- Google OAuth credentials (for social login)

### **Installation**

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd smart-student-hub
npm install
```

2. **Environment Setup:**
```bash
cp env.example .env.local
```

Fill in your environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=your_postgres_connection_string

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Database Setup:**
```bash
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations to database
```

4. **Development:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### **Build for Production**
```bash
npm run build
npm start
```

## 🎨 Design System

### **UI Components**
- Built with **shadcn/ui** for consistency and accessibility
- **Dark mode** support throughout the application
- **Responsive design** for mobile, tablet, and desktop
- **Glass morphism effects** and modern gradients

### **User Experience**
- **Role-based navigation** tailored to user type
- **Progressive disclosure** of complex features
- **Real-time updates** for notifications and status changes
- **Intuitive workflows** for common tasks

## 🔒 Security Features

### **Authentication**
- **Magic link authentication** for secure, passwordless login
- **Google OAuth** integration for convenience
- **JWT tokens** with automatic refresh
- **Session management** with secure cookies

### **Authorization**
- **Row Level Security (RLS)** policies in Supabase
- **Role-based permissions** at the API level
- **Input validation** with Zod schemas
- **File upload restrictions** and sanitization

### **Data Protection**
- **Privacy controls** for student profiles
- **GDPR-compliant** data handling
- **Audit logs** for sensitive operations
- **Encrypted file storage** in Supabase

## 📊 Analytics & Reporting

### **Student Analytics**
- Profile completion tracking
- Achievement progress over time
- Skill development insights
- Job application success rates

### **Institution Reporting**
- Department-wise performance metrics
- Student engagement analytics
- NAAC/NIRF compliance reports
- Placement and internship statistics

### **Faculty Insights**
- Mentee progress tracking
- Achievement approval analytics
- Event participation rates
- Student feedback aggregation

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**
- Works on any platform supporting Next.js (Netlify, Railway, etc.)
- Docker configuration available for containerized deployment
- Static export possible for CDN deployment

## 🧪 Testing

### **Unit Tests**
```bash
npm test                 # Run unit tests
npm run test:coverage    # Run with coverage report
npm run test:ui          # Run with UI interface
```

### **E2E Tests**
```bash
npm run test:e2e         # Run Playwright tests
```

### **Linting & Formatting**
```bash
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues
npm run format           # Format code with Prettier
```

## 📚 Documentation

### **API Routes**
- RESTful API design with Next.js API routes
- Type-safe endpoints with TypeScript
- Comprehensive error handling and validation
- Rate limiting and security middleware

### **Database Queries**
- Optimized queries with Drizzle ORM
- Proper indexing for common query patterns
- Connection pooling and query caching
- Automated migrations and schema management

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the established code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Supabase** for the excellent backend-as-a-service platform
- **Vercel** for hosting and deployment infrastructure
- **Next.js team** for the amazing React framework

## 📞 Support

For support and questions:
- 📧 **Email:** support@smartstudenthub.com
- 💬 **Discord:** [Join our community](https://discord.gg/smartstudenthub)
- 📖 **Docs:** [Full Documentation](https://docs.smartstudenthub.com)

---

**Smart Student Hub** - *Empowering every student with a verified digital identity* 🚀