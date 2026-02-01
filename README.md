<div align="center">

# 🌟 YARITU - Premium Clothing & Jewellery Rental Platform

[![Live Demo](https://img.shields.io/badge/Live-yaritu.vercel.app-blue?style=for-the-badge&logo=vercel)](https://yaritu.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/s3/)

**A modern, full-featured e-commerce platform for luxury clothing and jewellery rentals**

[Live Demo](https://yaritu.vercel.app) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started)

</div>

---

## 📖 About YARITU

YARITU is a sophisticated Next.js-based e-commerce platform designed for luxury clothing and jewellery rental services. The platform offers a seamless user experience with dynamic content management, admin controls, and modern UI/UX design principles.

### ✨ Key Highlights

- 🎨 **Modern UI/UX** - Sleek, responsive design with smooth animations using Framer Motion
- 🔐 **Secure Authentication** - NextAuth.js integration for secure user sessions
- 📱 **Mobile-First** - Fully responsive design optimized for all devices
- ⚡ **High Performance** - Optimized with Next.js 15, image optimization, and CDN caching
- 🎥 **Rich Media** - Video galleries, image sliders, and dynamic content sections
- 👑 **Admin Dashboard** - Complete content management system for administrators
- 📊 **Analytics** - Google Analytics 4 integration for tracking user behavior

---

## 🎯 Features

### 🛍️ Customer Features

- **Dynamic Hero Section** - Auto-rotating hero images with smooth transitions
- **Featured Collections** - Curated showcase of premium items
- **Trending Now** - Video carousel highlighting popular items
- **Celebrity Section** - Showcase celebrity endorsements and collaborations
- **Store Locator** - Interactive store cards with location details
- **Product Catalog** - Comprehensive collection with filtering and search
- **Product Details** - Detailed product modals with image galleries
- **Testimonials** - Customer reviews and feedback slider
- **Contact Form** - EmailJS-powered contact system
- **WhatsApp Integration** - Direct customer support via WhatsApp
- **Offers & Promotions** - Dynamic offer banners and promotional content

### 🔧 Admin Features

- **Hero Image Management** - Upload and manage hero section images (desktop/mobile variants)
- **Store Management** - Add, edit, and delete store locations
- **Product Management** - Full CRUD operations for collections
- **Video Management** - Upload and manage trending videos
- **Celebrity Content** - Manage celebrity endorsements
- **Testimonial Management** - Add and edit customer testimonials
- **Offer Management** - Create and manage promotional offers
- **Credential Management** - Secure admin credential updates
- **Real-time Updates** - Changes reflect immediately across the platform

### 🎨 Design Features

- **Smooth Animations** - Framer Motion for fluid transitions
- **Skeleton Loaders** - Enhanced loading states for better UX
- **Responsive Grid Layouts** - Adaptive layouts for all screen sizes
- **Image Optimization** - Next.js Image component with AVIF/WebP support
- **Video Optimization** - Lazy loading and preloading strategies
- **Accessibility** - ARIA labels and keyboard navigation support

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.2](https://nextjs.org/) (App Router)
- **React**: 18.3.1
- **Styling**: CSS Modules + Global CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/) 12.23
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) + [Heroicons](https://heroicons.com/)
- **Image Handling**: Next.js Image Optimization

### Backend & Database
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) 8.19
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) 5.0
- **File Storage**: [AWS S3](https://aws.amazon.com/s3/) with presigned URLs
- **Email**: [EmailJS](https://www.emailjs.com/) + [Nodemailer](https://nodemailer.com/)

### DevOps & Tools
- **Deployment**: [Vercel](https://vercel.com/)
- **Analytics**: Google Analytics 4
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv
- **File Uploads**: Formidable + AWS SDK

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **MongoDB** database (local or cloud)
- **AWS S3** bucket (for file storage)
- **EmailJS** account (for contact forms)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yaritu.git
   cd yaritu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key

   # AWS S3
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_bucket_name

   # Base URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Google Analytics (Optional)
   NEXT_PUBLIC_GA_ID=your_ga_measurement_id

   # EmailJS (Optional)
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
YARITU/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── admin/           # Admin endpoints
│   │   ├── auth/            # Authentication
│   │   ├── collections/     # Product collections
│   │   ├── hero/            # Hero images
│   │   ├── stores/          # Store management
│   │   ├── trending/        # Trending videos
│   │   └── ...
│   ├── about/               # About page
│   ├── admin/               # Admin dashboard
│   ├── collection/          # Collection page
│   ├── contact/             # Contact page
│   ├── login/               # Login page
│   ├── sections/            # Reusable sections
│   └── layout.js            # Root layout
├── components/              # React components
│   ├── AddStoreModal.js
│   ├── CelebritySection.js
│   ├── ImageSlider.jsx
│   ├── ProductCard.js
│   ├── TestimonialsSlider.js
│   └── ...
├── lib/                     # Utilities
│   ├── dbConnect.js         # MongoDB connection
│   ├── gtag.js              # Google Analytics
│   └── ...
├── models/                  # Mongoose models
│   ├── Hero.js
│   ├── Store.js
│   ├── Collection.js
│   └── ...
├── public/                  # Static assets
│   └── images/
├── utils/                   # Helper functions
│   └── uploadFileWithPresign.js
├── next.config.mjs          # Next.js configuration
└── package.json
```

---

## 🔑 Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | ALL | NextAuth authentication |
| `/api/hero` | GET/POST | Hero images management |
| `/api/stores` | GET/POST | Store locations |
| `/api/collections` | GET/POST | Product collections |
| `/api/trending` | GET/POST/PUT | Trending videos |
| `/api/celebrity` | GET/POST | Celebrity content |
| `/api/testimonials` | GET/POST | Customer testimonials |
| `/api/offers` | GET/POST/PUT | Promotional offers |
| `/api/upload` | POST | File upload to S3 |
| `/api/contact` | POST | Contact form submission |

---

## 🎨 Screenshots

### Desktop View
![YARITU Desktop Preview](./docs/readme-1.png)

### Mobile View
![YARITU Mobile Preview](./docs/readme-2.png)

---

## ⚙️ Configuration

### Image Optimization

The platform uses Next.js Image Optimization with:
- **Formats**: AVIF, WebP
- **Quality**: 75-90%
- **Lazy Loading**: Automatic for off-screen images
- **Responsive Images**: Multiple device sizes

### Caching Strategy

- **Static Assets**: Cached at CDN edge
- **API Routes**: `revalidate = 60` for public endpoints
- **Cache-Control**: `s-maxage=60, stale-while-revalidate=300`

### Performance Optimizations

- ✅ Code splitting with Next.js App Router
- ✅ Dynamic imports for heavy components
- ✅ Image optimization with blur placeholders
- ✅ Video preloading for center carousel items
- ✅ Skeleton loaders for better perceived performance
- ✅ Compression enabled

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables

3. **Set Environment Variables**
   
   Add all variables from `.env.local` to Vercel:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET_NAME`
   - `NEXT_PUBLIC_BASE_URL`
   - `NEXT_PUBLIC_GA_ID` (optional)

4. **Deploy**
   
   Vercel will automatically deploy on every push to `main`

### Build for Production

```bash
npm run build
npm start
```

---

## 📊 Analytics

The platform includes Google Analytics 4 integration for tracking:
- Page views
- User interactions
- Conversion events
- Custom events

Set `NEXT_PUBLIC_GA_ID` in your environment variables to enable.

---

## 🔒 Security Features

- ✅ **NextAuth.js** - Secure session management
- ✅ **bcryptjs** - Password hashing
- ✅ **CORS Protection** - API route protection
- ✅ **Environment Variables** - Sensitive data protection
- ✅ **Presigned URLs** - Secure S3 uploads
- ✅ **Admin Role Checks** - Protected admin routes

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Dhruvesh Shyara**

- GitHub: [@Dhruvesh1611](https://github.com/Dhruvesh1611)
- Live Demo: [yaritu.vercel.app](https://yaritu.vercel.app)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [MongoDB](https://www.mongodb.com/) - Database
- [AWS S3](https://aws.amazon.com/s3/) - File storage
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

## 📞 Support

For support, email dhruvesh.shyara.cg@example.com or open an issue in the repository.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by Dhruvesh Shyara

</div>
