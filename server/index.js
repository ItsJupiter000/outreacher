const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Resend } = require('resend');  // npm install resend

dotenv.config();

const app = express();
app.use(cors({
    origin: '*',
    credentials: false
}));
app.use(express.json());

const DATA_FILE = path.join(__dirname, '../storage/data.json');
const TEMPLATE_FILE = path.join(__dirname, '../templates/email.html');
const RESUME_FILE = path.join(__dirname, '../files/resume.pdf');

// Helper to read data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    if (!raw || raw.trim() === '') return [];
    return JSON.parse(raw);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API: Search Company
app.post('/api/search', async (req, res) => {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required' });

    const isRelevant = (p) => {
        const title = (p.position || '').toLowerCase();
        const dept = (p.department || '').toLowerCase();
        return title.includes('hr') || title.includes('talent') ||
            title.includes('recruiter') || title.includes('people') ||
            dept.includes('hr') || dept.includes('people');
    };

    try {
        if (!process.env.HUNTER_API_KEY || process.env.HUNTER_API_KEY === 'your_hunter_api_key_here') {
            console.log('Using mock data for Hunter.io');
            const mockData = [
                { first_name: 'John', last_name: 'Doe', email: 'john@' + domain, position: 'HR Manager', department: 'HR' },
                { first_name: 'Jane', last_name: 'Smith', email: 'jane@' + domain, position: 'Talent Acquisition', department: 'HR' },
                { first_name: 'Mike', last_name: 'Ross', email: 'mike@' + domain, position: 'Software Engineer', department: 'Engineering' }
            ];
            return res.json(mockData.filter(isRelevant));
        }

        const axios = require('axios');
        const response = await axios.get(
            `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${process.env.HUNTER_API_KEY}`
        );
        res.json(response.data.data.emails.filter(isRelevant));
    } catch (error) {
        console.error('Hunter API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// API: Send Email
// Uses Resend (https://resend.com) via HTTP — works on Render free tier.
// Render blocks outbound SMTP ports 25/465/587 on free instances,
// so nodemailer/direct-SMTP will always ETIMEDOUT there.
app.post('/api/send', async (req, res) => {
    const { email, name, company, position, source } = req.body;

    try {
        const template = fs.readFileSync(TEMPLATE_FILE, 'utf8').replace('{{company_name}}', company);

        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
            console.log('No RESEND_API_KEY set — simulating email send to', email);
        } else {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const resumeContent = fs.readFileSync(RESUME_FILE); // Buffer

            const { error } = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
                to: email,
                subject: `Opportunity at ${company}`,
                html: template,
                attachments: [
                    {
                        filename: 'Resume.pdf',
                        content: resumeContent  // Resend accepts a Buffer directly
                    }
                ]
            });

            if (error) {
                console.error('Resend API error:', error);
                return res.status(500).json({ error: 'Failed to send email', detail: error.message });
            }
        }

        // Persist record
        const currentData = readData();
        currentData.push({
            id: Date.now().toString(),
            company_name: company,
            hr_name: name,
            email,
            title: position,
            status: 'sent',
            sent_at: new Date().toISOString(),
            source: source || 'manual'
        });
        writeData(currentData);

        res.json({ success: true });
    } catch (error) {
        console.error('Send Error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// API: Dashboard Data
app.get('/api/dashboard', (req, res) => {
    res.json(readData());
});

// API: Update Status
app.put('/api/status', (req, res) => {
    const { id, status } = req.body;
    const data = readData();
    const index = data.findIndex(r => r.id === id);

    if (index !== -1) {
        data[index].status = status;
        writeData(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});

// API: Delete Record
app.delete('/api/record/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const filtered = data.filter(r => r.id !== id);

    if (filtered.length < data.length) {
        writeData(filtered);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));