# Caldish - Food Nutrition Analysis Web App
## System Architecture Documentation

### 🎯 Project Overview
**Caldish** is a web application that allows users to upload photos of food dishes and receive detailed nutritional analysis powered by AI vision models. The app provides calorie estimates, macronutrient breakdowns, and ingredient identification.

### 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   External      │
│   (Next.js)     │◄──►│   (Next.js API)  │◄──►│   Services      │
│                 │    │                  │    │                 │
│ • Image Upload  │    │ • File Processing│    │ • OpenAI GPT-4V │
│ • UI Components │    │ • LLM Integration│    │ • Image Storage │
│ • State Mgmt    │    │ • Response Parse │    │ • Analytics     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🛠️ Technology Stack

#### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: React Query (TanStack Query)
- **File Upload**: React Dropzone
- **Charts**: Chart.js or Recharts
- **Image Processing**: HTML5 Canvas for client-side optimization

#### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **File Handling**: Multipart form processing
- **Image Processing**: Sharp.js for optimization
- **Validation**: Zod for schema validation
- **Error Handling**: Custom error middleware

#### External Services
- **Primary LLM**: OpenAI GPT-4 Vision
- **Backup LLM**: Google Gemini Pro Vision
- **Image Storage**: Temporary (in-memory or temp files)
- **Monitoring**: Vercel Analytics (optional)

### 📁 Project Structure

```
caldish/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page with upload
│   ├── globals.css                # Global styles
│   ├── api/
│   │   └── analyze-food/
│   │       └── route.ts           # Main analysis endpoint
│   └── results/
│       └── [id]/
│           └── page.tsx           # Results display page
├── components/
│   ├── ui/                        # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── spinner.tsx
│   ├── ImageUpload.tsx            # Drag-and-drop upload
│   ├── ImagePreview.tsx           # Image preview component
│   ├── LoadingState.tsx           # Analysis loading state
│   ├── NutritionResults.tsx       # Results display
│   ├── NutritionChart.tsx         # Visual nutrition breakdown
│   └── ErrorBoundary.tsx          # Error handling
├── lib/
│   ├── llm/
│   │   ├── openai-client.ts       # OpenAI integration
│   │   ├── gemini-client.ts       # Gemini backup
│   │   └── prompt-templates.ts    # LLM prompts
│   ├── utils/
│   │   ├── image-processor.ts     # Image optimization
│   │   ├── nutrition-parser.ts    # Parse LLM responses
│   │   ├── validation.ts          # Input validation
│   │   └── constants.ts           # App constants
│   └── types/
│       ├── nutrition.ts           # Nutrition data types
│       ├── api.ts                 # API response types
│       └── upload.ts              # Upload types
├── hooks/
│   ├── useImageUpload.ts          # Upload logic
│   ├── useNutritionAnalysis.ts    # Analysis hook
│   └── useLocalStorage.ts         # Persistence
└── public/
    ├── icons/                     # App icons
    └── examples/                  # Sample food images
```

### 🔄 Data Flow

#### 1. Image Upload Flow
```
User selects image → Client validation → Image preview → 
Compression/optimization → Upload to API endpoint
```

#### 2. Analysis Flow
```
Receive image → Validate format/size → Process with Sharp → 
Send to LLM API → Parse response → Structure nutrition data → 
Return to frontend
```

#### 3. Results Display Flow
```
Receive analysis → Store in state → Display nutrition breakdown → 
Generate charts → Enable export options
```

### 🤖 LLM Integration Strategy

#### Primary Prompt Template
```typescript
const NUTRITION_ANALYSIS_PROMPT = `
Analyze this food image and provide detailed nutritional information.

Requirements:
1. Identify all visible food items
2. Estimate portion sizes
3. Calculate nutritional values per serving
4. Provide confidence levels for estimates

Return JSON format:
{
  "foods": [
    {
      "name": string,
      "quantity": string,
      "confidence": number (0-1)
    }
  ],
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbohydrates": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  },
  "vitamins": {...},
  "notes": string
}
`;
```

#### Fallback Strategy
1. **Primary**: OpenAI GPT-4V
2. **Fallback**: Google Gemini Pro Vision
3. **Error Handling**: Generic nutrition database lookup

### 🗄️ Data Models

#### NutritionAnalysis Interface
```typescript
interface NutritionAnalysis {
  id: string;
  timestamp: Date;
  imageUrl?: string;
  foods: FoodItem[];
  nutrition: NutritionData;
  confidence: number;
  processingTime: number;
}

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  confidence: number;
}

interface NutritionData {
  calories: number;
  protein: number;      // grams
  carbohydrates: number;// grams
  fat: number;          // grams
  fiber: number;        // grams
  sugar: number;        // grams
  sodium: number;       // mg
  vitamins?: VitaminData;
  minerals?: MineralData;
}
```

### 🚀 API Endpoints

#### POST /api/analyze-food
**Purpose**: Analyze uploaded food image

**Request**:
```typescript
Content-Type: multipart/form-data
{
  image: File,
  options?: {
    includeVitamins: boolean,
    confidenceThreshold: number
  }
}
```

**Response**:
```typescript
{
  success: boolean,
  data?: NutritionAnalysis,
  error?: string,
  processingTime: number
}
```

#### GET /api/health
**Purpose**: Health check endpoint

### 🔒 Security & Privacy

#### Image Handling
- **Temporary Storage**: Images processed in memory/temp files
- **Auto Cleanup**: Delete images after processing
- **Size Limits**: Max 10MB per image
- **Format Validation**: Only JPEG, PNG, WebP

#### API Security
- **Rate Limiting**: 10 requests per minute per IP
- **Input Validation**: Strict file type/size validation
- **Error Sanitization**: No sensitive data in error messages
- **CORS**: Restricted to app domain

### 📊 Performance Considerations

#### Frontend Optimization
- **Image Compression**: Client-side resize before upload
- **Lazy Loading**: Components and images
- **Caching**: React Query for API responses
- **Bundle Splitting**: Dynamic imports for heavy components

#### Backend Optimization
- **Image Processing**: Sharp.js for fast optimization
- **LLM Caching**: Cache similar food analyses
- **Response Streaming**: Stream large responses
- **Error Recovery**: Graceful degradation

### 🚀 Deployment Strategy

#### Vercel Deployment (Recommended)
- **Framework**: Native Next.js support
- **API Routes**: Serverless functions
- **Environment**: Production/Preview environments
- **Monitoring**: Built-in analytics

#### Environment Variables
```bash
# Required
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://caldish.vercel.app

# Optional
GEMINI_API_KEY=...
ANALYTICS_ID=...
```

### 📈 Monitoring & Analytics

#### Key Metrics
- **Upload Success Rate**: Image processing success
- **Analysis Accuracy**: User feedback on results
- **Performance**: API response times
- **Usage**: Daily active users, images analyzed

#### Error Tracking
- **Client Errors**: Image upload failures
- **Server Errors**: LLM API failures
- **Performance**: Slow analysis detection

### 🔄 Future Enhancements

#### Phase 2 Features
- **User Accounts**: Save analysis history
- **Meal Planning**: Aggregate daily nutrition
- **Social Features**: Share results
- **Offline Mode**: PWA capabilities

#### Phase 3 Features
- **Custom Diets**: Keto, vegan tracking
- **Barcode Scanning**: Packaged food support
- **Recipe Import**: URL-based recipe analysis
- **Multi-language**: Internationalization

### 🧪 Testing Strategy

#### Unit Tests
- **Utils**: Image processing, nutrition parsing
- **Components**: Upload, results display
- **API**: Endpoint validation

#### Integration Tests
- **Upload Flow**: End-to-end image processing
- **LLM Integration**: Mock API responses
- **Error Handling**: Various failure scenarios

#### Performance Tests
- **Load Testing**: Multiple concurrent uploads
- **Memory Usage**: Image processing efficiency
- **API Limits**: Rate limiting validation

---

## Development Phases

### Phase 1: Core MVP (Week 1)
- [ ] Project setup with Next.js
- [ ] Basic image upload component
- [ ] LLM integration (OpenAI)
- [ ] Simple results display

### Phase 2: Enhanced UI (Week 2)
- [ ] Improved upload UX
- [ ] Nutrition charts/visualizations
- [ ] Error handling & loading states
- [ ] Responsive design

### Phase 3: Production Ready (Week 3)
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Deployment setup
- [ ] Documentation

---

*Last Updated: December 2024*
*Version: 1.0*
