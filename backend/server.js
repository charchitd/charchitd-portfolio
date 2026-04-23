// Only load .env file in local development — Vercel injects env vars automatically
if (!process.env.VERCEL) {
    require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
}

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();

// CORS: On Vercel, frontend & backend share the same domain, so same-origin works.
// In development, allow localhost. In production, restrict to FRONTEND_URL if set.
const corsOptions = {
    origin: process.env.VERCEL ? true : (process.env.FRONTEND_URL || '*'),
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Require JWT_SECRET - no insecure fallback
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is required');
    process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

// Rate limiting for login endpoint - prevent brute force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "Token expired. Please log in again." });
            }
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = user;
        next();
    });
};

// Password strength validation helper
const validatePasswordStrength = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    return null;
};

// --- AUTHENTICATION ---
app.post('/api/auth/login', loginLimiter, async (req, res) => {
    const { githubUser, password } = req.body;
    if (!githubUser || !password) return res.status(400).json({ error: "GitHub user and password required" });

    try {
        const result = await db.query('SELECT "githubAuthUser", "passwordHash" FROM profile WHERE id = 1');
        const row = result.rows[0];

        if (row && row.githubAuthUser && row.githubAuthUser.toLowerCase() === githubUser.trim().toLowerCase()) {
            const match = bcrypt.compareSync(password, row.passwordHash);
            if (match) {
                const token = jwt.sign({ user: githubUser }, JWT_SECRET, { expiresIn: '15m' });
                res.json({ token });
            } else {
                res.status(401).json({ error: "Invalid password." });
            }
        } else {
            res.status(401).json({ error: "Unauthorized GitHub account." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/auth/password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || !currentPassword) return res.status(400).json({ error: "Current and new required" });

    // Validate password strength
    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) return res.status(400).json({ error: strengthError });

    try {
        const result = await db.query('SELECT "passwordHash" FROM profile WHERE id = 1');
        const row = result.rows[0];

        const match = bcrypt.compareSync(currentPassword, row.passwordHash);
        if (!match) return res.status(401).json({ error: "Incorrect current password." });

        const newHash = bcrypt.hashSync(newPassword, 10);
        await db.query(`UPDATE profile SET "passwordHash" = $1 WHERE id = 1`, [newHash]);
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PROFILE ---
app.get('/api/profile', async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, title, bio, email, location, phone, image FROM profile WHERE id = 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
    const { name, title, bio, email, location, phone, image } = req.body;
    try {
        // Preserve githubAuthUser — never allow the frontend form to overwrite it
        await db.query(
            `UPDATE profile SET name = $1, title = $2, bio = $3, email = $4, location = $5, phone = $6, image = $7 WHERE id = 1`,
            [name, title, bio, email, location, phone, image]
        );
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- EXPERIENCE ---
app.get('/api/experience', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM experience");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/experience', authenticateToken, async (req, res) => {
    const { id, role, company, year, description } = req.body;
    try {
        await db.query(
            `INSERT INTO experience (id, role, company, year, description) VALUES ($1, $2, $3, $4, $5)`,
            [id, role, company, year, description]
        );
        res.json({ message: "Experience added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/experience/:id', authenticateToken, async (req, res) => {
    const { role, company, year, description } = req.body;
    try {
        await db.query(
            `UPDATE experience SET role = $1, company = $2, year = $3, description = $4 WHERE id = $5`,
            [role, company, year, description, req.params.id]
        );
        res.json({ message: "Experience updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/experience/:id', authenticateToken, async (req, res) => {
    try {
        await db.query(`DELETE FROM experience WHERE id = $1`, [req.params.id]);
        res.json({ message: "Experience deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PROJECTS ---
app.get('/api/projects', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM projects");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
    const { id, title, techStack, link, description } = req.body;
    try {
        await db.query(
            `INSERT INTO projects (id, title, "techStack", link, description) VALUES ($1, $2, $3, $4, $5)`,
            [id, title, techStack, link, description]
        );
        res.json({ message: "Project added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
    const { title, techStack, link, description } = req.body;
    try {
        await db.query(
            `UPDATE projects SET title = $1, "techStack" = $2, link = $3, description = $4 WHERE id = $5`,
            [title, techStack, link, description, req.params.id]
        );
        res.json({ message: "Project updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        await db.query(`DELETE FROM projects WHERE id = $1`, [req.params.id]);
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- THOUGHTS ---
app.get('/api/thoughts', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM thoughts");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/thoughts', authenticateToken, async (req, res) => {
    const { id, title, date, type, abstract, content } = req.body;
    try {
        await db.query(
            `INSERT INTO thoughts (id, title, date, type, abstract, content) VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, title, date, type, abstract, content]
        );
        res.json({ message: "Thought added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/thoughts/:id', authenticateToken, async (req, res) => {
    const { title, date, type, abstract, content } = req.body;
    try {
        await db.query(
            `UPDATE thoughts SET title = $1, date = $2, type = $3, abstract = $4, content = $5 WHERE id = $6`,
            [title, date, type, abstract, content, req.params.id]
        );
        res.json({ message: "Thought updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/thoughts/:id', authenticateToken, async (req, res) => {
    try {
        await db.query(`DELETE FROM thoughts WHERE id = $1`, [req.params.id]);
        res.json({ message: "Thought deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vercel serverless: export the Express app as a module
// For local development: run with `node server.js` which starts listening
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
