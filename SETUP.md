# 🚀 Caldish Setup Guide for Teammates

This guide will help you get the Caldish app running on your local machine.

## 📋 Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm or yarn** package manager
- **Git** for version control
- **Text editor** (VS Code recommended)

## 🛠️ Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/raycoderhk/caldish.git
cd caldish
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Copy these and add your actual API keys

# OpenAI API Key (for real food analysis)
OPENAI_API_KEY=sk-your-openai-api-key-here

# DeepSeek API Key (optional, vision not supported yet)
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here

# App Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Keys Setup

### OpenAI (Recommended)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account and add billing information
3. Generate a new API key
4. Add to `.env.local` as `OPENAI_API_KEY`

**Note**: GPT-4V usage costs approximately $0.01-0.02 per image analysis.

### Alternative: Mock Mode
The app works without API keys using mock data for demonstration purposes.

## 📁 Project Structure

```
caldish/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── *.tsx             # Feature components
├── lib/                   # Utilities and logic
│   ├── llm/              # LLM client implementations
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── hooks/                 # Custom React hooks
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🧪 Testing the App

1. **Upload an image**: Use any food photo (JPG, PNG, WebP)
2. **Analysis**: Watch the AI analyze the food (mock data if no API key)
3. **PDF Export**: Test the PDF generation feature
4. **User Profile**: Try the personalized nutrition features

## 🔧 Development Workflow

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Git Workflow
```bash
git checkout -b feature/your-feature-name
# Make your changes
git add .
git commit -m "Add your feature description"
git push origin feature/your-feature-name
# Create pull request on GitHub
```

## 🚨 Common Issues

### Node.js Version
- **Issue**: Build fails or dependencies won't install
- **Solution**: Update to Node.js 18+ (`node --version`)

### API Key Errors
- **Issue**: "OpenAI API key is required" error
- **Solution**: Add valid API key to `.env.local` or use mock mode

### Port Already in Use
- **Issue**: "Port 3000 is already in use"
- **Solution**: Kill the process (`lsof -ti:3000 | xargs kill`) or use different port

### Image Upload Issues
- **Issue**: Upload fails or image too large
- **Solution**: Use JPG/PNG under 10MB, avoid HEIF/HEIC formats

## 🎯 Key Features to Test

- [x] Image upload and preview
- [x] AI food analysis (mock or real)
- [x] Nutrition breakdown display
- [x] User profile customization
- [x] PDF export functionality
- [x] Responsive design on mobile

## 📞 Need Help?

1. **Check existing issues**: [GitHub Issues](https://github.com/raycoderhk/caldish/issues)
2. **Create new issue**: Describe the problem with screenshots
3. **Contact Raymond**: [your-email@example.com](mailto:your-email@example.com)

## 🏗️ Next Steps for Development

- [ ] Add real-time collaboration features
- [ ] Implement user authentication
- [ ] Add food database integration
- [ ] Create mobile app version
- [ ] Add nutritionist review system

---

**Happy coding! 🚀**
