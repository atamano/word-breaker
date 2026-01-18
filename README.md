# Word Breaker

A web application to remove edit protection from Word documents (.docx files).

## Features

- Drag and drop interface for uploading .docx files
- Removes document protection (forms, readOnly, comments, trackedChanges)
- Instant download of unprotected file
- No server-side storage - files are processed in memory

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- JSZip for docx manipulation
- react-dropzone for file uploads

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on Vercel. Simply connect your repository to Vercel for automatic deployments.

## How It Works

Word documents (.docx) are ZIP archives containing XML files. Document protection is stored in `word/settings.xml` as a `<w:documentProtection>` element. This app extracts the archive, removes the protection element, and repackages the document.

## License

MIT
