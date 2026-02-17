const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const axios = require('axios');

dotenv.config();

const app = express();
// app.use(cors());
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
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    if (!data || data.trim() === '') return [];
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API: Search Company
app.post('/api/search', async (req, res) => {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required' });

    try {
        // Mock response if no API key
        if (!process.env.HUNTER_API_KEY || process.env.HUNTER_API_KEY === 'your_hunter_api_key_here') {
            console.log('Using Mock Data for Hunter.io');
            const mockData = [
                { first_name: 'John', last_name: 'Doe', email: 'john@' + domain, position: 'HR Manager', department: 'HR' },
                { first_name: 'Jane', last_name: 'Smith', email: 'jane@' + domain, position: 'Talent Acquisition', department: 'HR' },
                { first_name: 'Mike', last_name: 'Ross', email: 'mike@' + domain, position: 'Software Engineer', department: 'Engineering' } // Should be filtered out
            ];
            // Filter relevant departments/titles
            const relevant = mockData.filter(p => {
                const title = (p.position || '').toLowerCase();
                const dept = (p.department || '').toLowerCase();
                return title.includes('hr') || title.includes('talent') || title.includes('recruiter') || title.includes('people') || dept.includes('hr') || dept.includes('people');
            });

            return res.json(relevant);
        }

        const response = await axios.get(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${process.env.HUNTER_API_KEY}`);
        const emails = response.data.data.emails;

        // Filter logic
        const relevant = emails.filter(p => {
            const title = (p.position || '').toLowerCase();
            const dept = (p.department || '').toLowerCase();
            return title.includes('hr') || title.includes('talent') || title.includes('recruiter') || title.includes('people') || dept.includes('hr') || dept.includes('people');
        });

        res.json(relevant);
    } catch (error) {
        console.error('Hunter API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// API: Send Email
app.post('/api/send', async (req, res) => {
    const { email, name, company, position, source } = req.body;

    // Load template
    let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    template = template.replace('{{company_name}}', company);
    // You could replace other fields too like {{name}}

    // Nodemailer transport
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true, // Use SSL
    //     auth: {
    //         user: process.env.GMAIL_USER,
    //         pass: process.env.GMAIL_APP_PASSWORD
    //     },
    //     // Force IPv4 to avoid ENETUNREACH errors on some networks (like Render/Vercel)
    //     family: 4,
    //     pool: true, // Use pooled connections for better performance
    //     maxConnections: 1, // Limit concurrent connections to avoid rate limits
    //     rateLimit: 5 // Limit messages per second
    // });

    // Configure Nodemailer with standard settings and forced IPv4
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        },
        // Force IPv4 to avoid ENETUNREACH errors commonly seen on platforms like Render due to IPv6 routing issues
        family: 4
    });


    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Opportunity at ${company}`,
        html: template,
        attachments: [
            {
                filename: 'Resume.pdf',
                path: RESUME_FILE
            }
        ]
    };

    try {
        debugger;
        if (!process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD === 'your_app_password_here') {
            console.log('Simulating email send to', email);
            // Simulate success
        } else {
            await transporter.sendMail(mailOptions);
        }

        // Update storage
        const currentData = readData();
        const newRecord = {
            id: Date.now().toString(),
            company_name: company,
            hr_name: name,
            email,
            title: position,
            status: 'sent',
            sent_at: new Date().toISOString(),
            source: source || 'manual'
        };
        currentData.push(newRecord);
        writeData(currentData);

        res.json({ success: true });
    } catch (error) {
        console.error('Email Send Error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// API: Dashboard Data
app.get('/api/dashboard', (req, res) => {
    const data = readData();
    res.json(data);
});

// API: Update Status
app.put('/api/status', (req, res) => {
    const { id, status } = req.body;
    const currentData = readData();
    const index = currentData.findIndex(r => r.id === id);

    if (index !== -1) {
        currentData[index].status = status;
        writeData(currentData);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});

// API: Delete Record
app.delete('/api/record/:id', (req, res) => {
    const { id } = req.params;
    const currentData = readData();
    const filtered = currentData.filter(r => r.id !== id);

    if (filtered.length < currentData.length) {
        writeData(filtered);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
