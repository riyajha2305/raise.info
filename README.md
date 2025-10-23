# raise.info 📈

> Discover salary insights and compensation data across top companies

A modern web application that provides transparent salary insights to help professionals make informed career decisions. Built with Next.js and featuring an intuitive interface for exploring salary data across various companies, locations, and experience levels.

![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🔍 **Advanced Filtering**: Search and filter by company, location, designation, and years of experience
- 📊 **Comprehensive Data**: View min, max, and average salary information
- 🎯 **Smart Autocomplete**: Quick company search with real-time suggestions
- 📱 **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional interface with gradient accents
- 📧 **Contact Form**: Integrated contact system with email notifications
- 🔄 **Real-time Updates**: Live data filtering and sorting
- 📄 **Pagination**: Easy navigation through large datasets

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.0](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: Custom React components
- **Form Handling**: Web3Forms integration
- **Deployment**: Optimized for Vercel deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/raise.info.git
   cd raise.info
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```

   Get your free access key from [Web3Forms](https://web3forms.com)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📧 Contact Form Setup

The contact form uses Web3Forms to send submissions directly to your email:

1. Visit [https://web3forms.com](https://web3forms.com)
2. Enter your email address: `ssaswat786@gmail.com`
3. Get your free access key
4. Add it to `.env.local` as shown above
5. Restart your development server

For detailed instructions, see [CONTACT_FORM_SETUP.md](./CONTACT_FORM_SETUP.md)

## 📁 Project Structure

```
raise.info/
├── src/
│   ├── app/
│   │   ├── about/          # About Us page
│   │   ├── contact/        # Contact page with form
│   │   ├── page.tsx        # Main salary insights page
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── globals.css     # Global styles
│   │   └── icon.jpg        # Favicon
│   └── data/
│       └── salaries.json   # Salary data
├── public/                 # Static assets
├── .env.local             # Environment variables (create this)
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

### Colors

- **Primary**: `#80A1BA` - Soft blue-gray
- **Secondary**: `#5A7A8A` - Darker blue-gray
- **Accent**: `#6B8BA0` - Medium blue-gray
- **Background**: Gradient from `gray-50` to `gray-100`

### Typography

- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Headings**: Gradient text with brand colors

## 👥 Team

This project was developed by:

- **[Riya Kumari Jha](https://www.linkedin.com/in/riya-jha-7b4774210/)** - Developer
- **[Saswat Samal](https://www.linkedin.com/in/saswatsam/)** - Developer

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📬 Contact

For questions or feedback, please reach out:
- Email: ssaswat786@gmail.com
- Use the [contact form](http://localhost:3000/contact) on the website

## 🙏 Acknowledgments

- Salary data sourced from community contributions
- Built with modern web technologies
- Inspired by the need for salary transparency in tech

## 🚢 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Made with ❤️ by Riya Kumari Jha and Saswat Samal
