# 🍽️ Caldish - AI-Powered Food Nutrition Analysis

A modern web application that uses artificial intelligence to analyze food photos and provide detailed nutritional information including calories, macronutrients, vitamins, and minerals.

## ✨ Features

- **🤖 AI-Powered Analysis**: Advanced computer vision with OpenAI GPT-4V
- **⚡ Instant Results**: Get nutrition facts in seconds
- **📊 Comprehensive Data**: Calories, macros, vitamins, minerals, and portion estimates
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🎨 Beautiful UI**: Modern, clean interface built with Tailwind CSS
- **🔒 Privacy-First**: Images are processed temporarily and not stored

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key with GPT-4V access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/caldish.git
   cd caldish
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and state management
- **Chart.js** - Beautiful nutrition charts
- **React Dropzone** - Drag-and-drop file uploads

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **OpenAI GPT-4V** - AI vision for food analysis
- **Sharp** - High-performance image processing
- **Zod** - Runtime type validation

### Deployment
- **Vercel** - Recommended hosting platform
- **Environment Variables** - Secure API key management

## 📖 Usage

1. **Upload Image**: Drag and drop or click to select a food photo
2. **Configure Options**: Choose analysis settings (vitamins, confidence level, etc.)
3. **Analyze**: Click "Analyze Nutrition" to start AI processing
4. **View Results**: Get detailed nutrition breakdown with confidence scores
5. **Export/Share**: Save results or analyze another image

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- Maximum size: 10MB
- Recommended: Well-lit, clear images with full dish visible

## 🎯 API Usage

### Analyze Food Endpoint

```typescript
POST /api/analyze-food

// Form Data
{
  image: File,
  options?: {
    includeVitamins: boolean,
    includeMinerals: boolean,
    confidenceThreshold: number,
    detailedBreakdown: boolean
  }
}

// Response
{
  success: boolean,
  data: {
    analysis: {
      id: string,
      foods: FoodItem[],
      nutrition: NutritionData,
      overallConfidence: number,
      processingTime: number,
      notes?: string,
      warnings?: string[]
    }
  }
}
```

### Health Check

```typescript
GET /api/analyze-food

// Response
{
  success: true,
  message: "Food analysis API is running",
  timestamp: string,
  version: string
}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key with GPT-4V access | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL for metadata | No |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | Maximum upload size in bytes | No |
| `GEMINI_API_KEY` | Google Gemini API key (backup) | No |

### Image Processing Settings

```typescript
// lib/constants.ts
export const IMAGE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxDimensions: { width: 2048, height: 2048 },
  compressionQuality: 0.9,
};
```

### Analysis Options

```typescript
interface AnalysisOptions {
  includeVitamins?: boolean;        // Include vitamin analysis
  includeMinerals?: boolean;        // Include mineral analysis
  confidenceThreshold?: number;     // Minimum confidence (0.1-1.0)
  detailedBreakdown?: boolean;      // Detailed ingredient analysis
}
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables** in Vercel dashboard
3. **Deploy**: Automatic deployment on git push

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

## 💡 Tips for Best Results

### Photography Tips
- **Good Lighting**: Use natural light when possible
- **Full Dish**: Capture the entire meal in frame
- **Clear Focus**: Avoid blurry or heavily filtered images
- **Minimal Background**: Reduce visual distractions

### Analysis Accuracy
- **Single Dish**: Works best with one main dish per photo
- **Visible Ingredients**: Ensure key ingredients are clearly visible
- **Standard Servings**: Results are more accurate for typical portion sizes
- **Fresh Foods**: Better recognition for whole foods vs. heavily processed items

## 🔧 Troubleshooting

### Common Issues

**"Failed to analyze image"**
- Check OpenAI API key is valid and has GPT-4V access
- Verify image meets size and format requirements
- Try with a clearer, well-lit image

**"Network error"**
- Check internet connection
- Verify API endpoint is accessible
- Check for any firewall or proxy issues

**"Rate limit exceeded"**
- OpenAI API rate limits reached
- Wait a few minutes before trying again
- Consider upgrading OpenAI plan for higher limits

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages and logs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

Nutrition analysis is AI-generated and provided for informational purposes only. Results are estimates and may not be completely accurate. Always consult with healthcare professionals for dietary advice and medical nutrition therapy.

## 🙏 Acknowledgments

- OpenAI for GPT-4V technology
- Next.js team for the amazing framework
- Tailwind CSS for the beautiful styling system
- All contributors and users of this project

---

**Made with ❤️ by Raymond**

For support or questions, please open an issue or contact [your-email@example.com](mailto:your-email@example.com)
