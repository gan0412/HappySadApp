# Happy Sad Editor

A Next.js application featuring AI-powered text editors that can transform content to be either positive/happy or negative/sad. Built for the Civic Engineering Team fullstack assignment.

## Features

### Core Features
- **Two Separate Pages**: `/happy` and `/sad` with distinct text editors
- **AI Content Rewriting**: Use `/rewrite` slash command to transform text with AI
- **Local Storage Persistence**: Content automatically saved and restored
- **Real-time Collaboration**: Multiple users can edit together using WebRTC
- **Interactive Elements**: Click "happy" or "sad" words to see inspirational quotes

### Technology Stack
- Next.js 16 (App Router)
- TypeScript
- Plate.js (Rich Text Editor)
- Shadcn UI (Popover components)
- OpenAI API (Text rewriting)
- Yjs + WebRTC (Real-time collaboration)
- Tailwind CSS (Styling)

## Getting Started

### Prerequisites
- Node.js 20.9.0 or higher
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd HappySadApp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Basic Usage

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Choose either the Happy Editor or Sad Editor
3. Start typing in the editor

### AI Rewriting

To rewrite your text with AI:
1. Type your content
2. Add `/rewrite` at the end
3. Press Enter or wait a moment
4. Your text will be transformed to match the page's mood

**Example:**
- On `/happy`: "The weather is okay today /rewrite" → "The weather is absolutely beautiful and delightful today!"
- On `/sad`: "The weather is okay today /rewrite" → "The weather is dreary and disappointing today"

### Interactive Elements

When you type the words "happy" or "sad":
- They appear highlighted with a cursor pointer
- Click them to see a random quote in a popover
- Works on both `/happy` and `/sad` pages

### Real-time Collaboration

To collaborate with others:
1. Go to either `/happy` or `/sad` page
2. Enter a Room ID in the collaboration section
3. Click "Join Room"
4. Share the same Room ID with collaborators
5. Edit together in real-time!

**Note**: Collaborators must use the same page (both on `/happy` or both on `/sad`)

## Project Structure

```
HappySadApp/
├── app/
│   ├── api/
│   │   └── rewrite/          # AI rewriting API endpoint
│   ├── happy/                # Happy editor page
│   ├── sad/                  # Sad editor page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── editor/
│   │   ├── PlateEditor.tsx          # Main editor component
│   │   ├── CollaborativeEditor.tsx  # Collaborative editor
│   │   ├── HappyElement.tsx         # Happy text element
│   │   ├── SadElement.tsx           # Sad text element
│   │   └── EmotionLeaf.tsx          # Interactive word renderer
│   └── ui/
│       └── popover.tsx              # Shadcn popover component
├── hooks/
│   ├── useLocalStorage.ts    # Local storage hook
│   └── useAI.ts              # AI rewriting hook
├── lib/
│   ├── plate-config.ts       # Plate.js configuration
│   ├── collaboration.ts      # Yjs collaboration setup
│   ├── quotes.ts             # Happy/sad quotes
│   └── utils.ts              # Utility functions
└── types/
    └── plate-elements.ts     # TypeScript types
```

## Features Implemented

### ✅ Next.js Setup
- Modern Next.js 16 with App Router
- TypeScript configuration
- Proper routing for `/happy` and `/sad` pages

### ✅ Plate.js Integration
- Full rich text editor implementation
- Custom element types for interactive words
- Proper TypeScript support

### ✅ AI Slash Commands
- `/rewrite` command on both pages
- OpenAI integration for text transformation
- Happy/positive rewriting on `/happy`
- Sad/negative rewriting on `/sad`

### ✅ Data Persistence
- Local storage integration
- Content restored on page refresh
- Separate storage keys for each page

### ✅ Custom Interactive Elements
- "happy" and "sad" words become interactive
- Pointer cursor on hover
- Click to show popover with quotes
- Shadcn UI popover integration
- Works on both pages

### ✅ Real-time Collaboration
- Yjs integration with WebRTC
- Room-based collaboration
- Multiple users can edit simultaneously
- Shared document state

## Technical Highlights

### Code Reusability
- Shared `PlateEditor` component used by both pages
- Reusable hooks for AI and local storage
- Common UI components from Shadcn

### TypeScript
- Full TypeScript implementation
- Custom type definitions for Plate elements
- Proper typing throughout the codebase

### Performance
- Memoized plugin creation
- Efficient local storage updates
- Optimized re-renders

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Deployment

This project can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any platform supporting Next.js

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Make sure to add your `OPENAI_API_KEY` in the Vercel environment variables.

## License

MIT

## Author

Built for the Civic Engineering Team assessment.
