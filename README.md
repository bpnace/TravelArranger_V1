# Travel Planner

A modern, full-stack travel planning web application built with SvelteKit, TypeScript, Tailwind CSS, and Supabase. Plan your trips with AI-powered suggestions, manage packing lists, and collaborate with friends.

## 🚀 Features

### Authentication & User Management
- **User Registration & Login** - Secure authentication with Supabase Auth
- **Guest Login** - Quick access without email verification for demo purposes
- **Session Management** - Persistent login state with SSR support
- **User Dashboard** - Personalized trip overview

### Trip Management
- **Create New Trips** - Manual trip creation with destination, dates, and notes
- **AI-Powered Suggestions** - Get intelligent trip recommendations (Ollama/Qwen3 integration ready)
- **Trip Dashboard** - View upcoming and past trips with destination flags
- **Trip Details** - Comprehensive trip information and planning tools

### AI Integration (Ready for Implementation)
- **Trip Suggestions** - AI-generated destination recommendations and itineraries
- **Packing List Generation** - Smart packing suggestions based on destination and duration
- **Weather-Aware Planning** - Seasonal recommendations and weather considerations

### Collaboration Features (Planned)
- **Friend Invitations** - Invite friends to collaborate on trips
- **Shared Trip Planning** - Real-time collaboration on trip details
- **Trip Sharing** - Share trip itineraries with friends and family

### Technical Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **TypeScript** - Full type safety throughout the application
- **Real-time Updates** - Live data synchronization with Supabase
- **Progressive Web App** - Installable and offline-capable
- **SEO Optimized** - Server-side rendering for better search visibility

## 🛠 Tech Stack

### Frontend
- **SvelteKit** - Full-stack web framework with SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Svelte** - Beautiful, customizable icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Supabase Auth** - Authentication and user management
- **Supabase SSR** - Server-side rendering support
- **PostgreSQL** - Reliable, scalable database

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing

### AI & External Services (Ready for Integration)
- **Ollama** - Local AI model inference
- **Qwen3** - Alternative AI model for suggestions
- **Google Maps API** - Trip route visualization
- **Weather API** - Climate-aware planning

## 📦 Project Structure

```
travel-planner/
├── src/
│   ├── lib/
│   │   ├── supabaseClient.ts      # Browser Supabase client
│   │   ├── supabaseServer.ts      # Server-side Supabase client
│   │   └── tailwind.css          # Tailwind base styles
│   ├── routes/
│   │   ├── +layout.svelte        # Root layout with navigation
│   │   ├── +layout.server.ts     # Server-side layout logic
│   │   ├── +page.svelte          # Dashboard page
│   │   ├── auth/
│   │   │   └── +page.svelte      # Authentication page
│   │   ├── trips/
│   │   │   └── +page.svelte      # Trip creation page
│   │   ├── auth.ts               # Auth API endpoint
│   │   └── api/
│   │       └── ai-suggestion/
│   │           └── +server.ts    # AI suggestion API
│   ├── app.d.ts                  # SvelteKit app types
│   ├── app.html                  # HTML template
│   └── hooks.server.ts           # Server hooks
├── static/                       # Static assets
├── .svelte-kit/                  # SvelteKit build output
└── package.json                  # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- pnpm (recommended package manager)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bpnace/codex_test1.git
   cd travel-planner
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Enable Authentication in your Supabase dashboard
   - Configure email templates (optional)
   - Set up Row Level Security (RLS) policies

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Database Setup (Supabase)

Create the following tables in your Supabase database:

```sql
-- Trips table
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);
```

## 🧪 Testing

### Run tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test UI
pnpm test:ui
```

### Code quality
```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm check
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `build`
4. Add environment variables

### Manual Deployment
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🔧 Configuration

### Environment Variables
- `PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `OLLAMA_URL` - Ollama server URL (for AI features)
- `GOOGLE_MAPS_API_KEY` - Google Maps API key (for route visualization)

### Tailwind Configuration
The project uses Tailwind CSS with custom configuration:
- Forms plugin for better form styling
- Typography plugin for rich text content
- Aspect ratio plugin for responsive media

### Supabase Configuration
- SSR support enabled
- Row Level Security (RLS) policies configured
- Real-time subscriptions ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Trip creation and management
- [x] Dashboard with trip overview
- [x] AI suggestion framework

### Phase 2: Enhanced Features 🚧
- [ ] Trip details page with Google Maps
- [ ] Packing list functionality
- [ ] Friend invitation system
- [ ] Real-time collaboration

### Phase 3: Advanced Features 📋
- [ ] Weather integration
- [ ] Expense tracking
- [ ] Photo sharing
- [ ] Mobile app (React Native/Expo)

### Phase 4: AI Enhancement 🤖
- [ ] Ollama integration for local AI
- [ ] Qwen3 model integration
- [ ] Advanced trip suggestions
- [ ] Smart packing recommendations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) - The web framework
- [Supabase](https://supabase.com/) - Backend and database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the [SvelteKit documentation](https://kit.svelte.dev/)
- Review the [Supabase documentation](https://supabase.com/docs)

---

**Built with ❤️ using modern web technologies**
