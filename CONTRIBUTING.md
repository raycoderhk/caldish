# 🤝 Contributing to Caldish

Thank you for your interest in contributing to Caldish! This guide will help you get started.

## 🚀 Quick Start for Contributors

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/caldish.git`
3. **Follow** the [SETUP.md](./SETUP.md) guide
4. **Create** a feature branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes
6. **Test** thoroughly
7. **Submit** a pull request

## 🎯 Areas for Contribution

### 🔥 High Priority
- **Real LLM Integration**: Improve OpenAI/DeepSeek integration
- **Image Processing**: Better food detection algorithms
- **User Experience**: UI/UX improvements
- **Performance**: Optimization and caching

### 🌟 Feature Ideas
- **Authentication**: User accounts and history
- **Database**: Store analysis results
- **Mobile App**: React Native version
- **Batch Processing**: Multiple image analysis
- **Recipe Suggestions**: Based on nutrition goals

### 🐛 Bug Fixes
- **Cross-browser**: Ensure compatibility
- **Error Handling**: Improve error messages
- **Edge Cases**: Handle unusual inputs

## 📋 Development Guidelines

### Code Style
- **TypeScript**: Strict typing required
- **ESLint**: Follow existing linting rules
- **Prettier**: Auto-format on save
- **Comments**: Document complex logic

### Component Structure
```typescript
// components/YourComponent.tsx
interface YourComponentProps {
  // Define props with TypeScript
}

export function YourComponent({ ...props }: YourComponentProps) {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
}
```

### Testing
- Test all new features manually
- Verify PDF export works
- Check mobile responsiveness
- Test with/without API keys

## 🔄 Pull Request Process

### Before Submitting
- [ ] Code follows project style
- [ ] All features tested manually
- [ ] No console errors in browser
- [ ] Responsive design verified
- [ ] Documentation updated if needed

### PR Template
```markdown
## What does this PR do?
Brief description of changes

## Testing
- [ ] Manual testing completed
- [ ] Works with mock data
- [ ] Works with real API keys
- [ ] Mobile responsive

## Screenshots
Include before/after if UI changes

## Notes
Any additional context
```

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **LLM**: OpenAI GPT-4V, DeepSeek (fallback)
- **PDF**: jsPDF for client-side generation
- **State**: React hooks, localStorage for persistence

### Key Directories
```
app/                 # Next.js app router
├── api/            # Backend API endpoints
├── page.tsx        # Main application page
├── layout.tsx      # Root layout
└── globals.css     # Global styles

components/          # React components
├── ui/             # Reusable UI elements
├── ImageUpload.tsx # File upload handling
├── NutritionResults.tsx # Results display
└── UserProfileModal.tsx # User settings

lib/                # Business logic
├── llm/            # LLM client implementations
├── types/          # TypeScript interfaces
├── utils/          # Helper functions
└── constants.ts    # App configuration

hooks/              # Custom React hooks
├── useNutritionAnalysis.ts
└── useUserProfile.ts
```

## 🔑 Environment Variables

Create `.env.local` with:
```env
# Required for real analysis
OPENAI_API_KEY=sk-your-key-here

# Optional
DEEPSEEK_API_KEY=sk-your-key-here

# App config
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

## 🚨 Important Notes

### Security
- **Never commit** API keys to git
- **Use environment variables** for sensitive data
- **Validate inputs** on both client and server
- **Handle errors gracefully**

### Performance
- **Optimize images** before analysis
- **Use lazy loading** for heavy components
- **Minimize API calls** where possible
- **Cache results** when appropriate

### Accessibility
- **Alt text** for images
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** compliance

## 🎨 Design Guidelines

### UI Principles
- **Clean and minimal** interface
- **Consistent spacing** using Tailwind
- **Clear visual hierarchy**
- **Mobile-first** responsive design

### Color Palette
```css
/* Primary green theme */
--primary-50: #f0fdf4;
--primary-500: #22c55e;
--primary-600: #16a34a;
--primary-700: #15803d;

/* Supporting colors */
--gray-50: #f9fafb;
--blue-500: #3b82f6;
--amber-500: #f59e0b;
--red-500: #ef4444;
```

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Tools
- **VS Code** with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in commit messages

## 📞 Questions?

- **Issues**: [GitHub Issues](https://github.com/raycoderhk/caldish/issues)
- **Discussions**: [GitHub Discussions](https://github.com/raycoderhk/caldish/discussions)
- **Email**: [your-email@example.com](mailto:your-email@example.com)

---

**Thank you for making Caldish better! 🙏**
