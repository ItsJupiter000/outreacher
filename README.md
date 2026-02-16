# Job Outreach Email Sender Bot

A modern web application for automating job outreach emails with HR contact discovery, email tracking, and status management.

## Features

- 🔍 **Company Search**: Find HR contacts using Hunter.io API
- ✉️ **Email Automation**: Send personalized outreach emails with resume attachments
- 📊 **Dashboard**: Track sent emails with advanced filtering and sorting
- 🎯 **Data Management**: Pagination, sorting, and multi-filter support
- 📱 **Mobile Responsive**: Fully optimized for all devices
- 🎨 **Modern UI**: Built with Next.js, Tailwind CSS, and shadcn/ui

## Tech Stack

**Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui  
**Backend**: Node.js, Express, Nodemailer  
**Storage**: JSON file-based storage

## Quick Start

### Prerequisites
- Node.js 18+
- Gmail account with App Password
- Hunter.io API key (optional)

### Installation

1. **Clone and install**
```bash
git clone https://github.com/YOUR_USERNAME/job-outreach-bot.git
cd job-outreach-bot

# Install backend
cd server && npm install

# Install frontend
cd ../client && npm install
```

2. **Configure environment**

Create `server/.env`:
```env
PORT=5000
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
HUNTER_API_KEY=your-hunter-api-key
```

3. **Add resume**: Place your resume as `files/resume.pdf`

4. **Run application**
```bash
# Terminal 1 - Backend
cd server && node index.js

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit `http://localhost:3000`

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/job-outreach-bot.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
5. Add environment variables:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `HUNTER_API_KEY`
   - `PORT`
6. Click "Deploy"

### 3. Auto-Deploy (CI/CD)

Vercel automatically sets up CI/CD:
- ✅ Push to `main` → Auto-deploy to production
- ✅ Pull requests → Preview deployments
- ✅ Automatic HTTPS and CDN
- ✅ Build logs and monitoring

**That's it!** Every push to `main` will automatically deploy to production.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GMAIL_USER` | Gmail address for sending emails | Yes |
| `GMAIL_APP_PASSWORD` | Gmail app password ([Get one](https://support.google.com/accounts/answer/185833)) | Yes |
| `HUNTER_API_KEY` | Hunter.io API key | No* |
| `PORT` | Backend port (default: 5000) | No |

*Without Hunter API key, mock data will be used

## Project Structure

```
emailer/
├── client/              # Next.js frontend
│   ├── app/            # App router pages
│   ├── components/     # UI components
│   └── hooks/          # Custom hooks
├── server/             # Express backend
│   └── index.js        # API server
├── storage/            # JSON data storage
├── templates/          # Email templates
└── files/              # Resume storage
```

## Usage

### Search for Contacts
1. Navigate to "Search" tab
2. Enter company domain (e.g., `stripe.com`)
3. Click "Search" to find HR contacts
4. Click "Send" to send outreach email

### Track History
1. Navigate to "History" tab
2. Filter by status, source, or search
3. Sort by clicking column headers
4. Update status or delete records
5. Use pagination controls

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search` | Search company contacts |
| POST | `/api/send` | Send outreach email |
| GET | `/api/dashboard` | Get sent history |
| PUT | `/api/status` | Update email status |
| DELETE | `/api/record/:id` | Delete record |

## License

MIT License

---

Built with ❤️ using Next.js and Node.js
