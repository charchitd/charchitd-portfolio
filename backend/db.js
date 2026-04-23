// Only load .env file in local development — Vercel injects env vars automatically
if (!process.env.VERCEL) {
    require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
}

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Require DATABASE_URL - no insecure fallback
if (!process.env.DATABASE_URL) {
    console.error('FATAL: DATABASE_URL environment variable is required');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Lazy initialization: runs once on first query, works reliably in serverless
let initPromise = null;

const initializeDatabase = async () => {
    try {
        // --- PROFILE TABLE ---
        // Create table if it doesn't exist (preserves data across restarts)
        await pool.query(`CREATE TABLE IF NOT EXISTS profile (
            id SERIAL PRIMARY KEY,
            name TEXT,
            title TEXT,
            bio TEXT,
            email TEXT,
            location TEXT,
            phone TEXT,
            image TEXT,
            "githubAuthUser" TEXT,
            "passwordHash" TEXT
        )`);

        // Only seed if table is empty (first deployment)
        const profileCount = await pool.query("SELECT count(*) as count FROM profile");
        if (parseInt(profileCount.rows[0].count) === 0) {
            // Require strong admin password - no insecure fallback
            if (!process.env.ADMIN_PASSWORD) {
                console.error('FATAL: ADMIN_PASSWORD environment variable is required for initial setup');
                process.exit(1);
            }
            const defaultHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
            await pool.query(`INSERT INTO profile (id, name, title, bio, email, location, phone, image, "githubAuthUser", "passwordHash") 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [1, "Charchit Dhawan", "AI Product Manager · Builder · Open-Source Contributor", "AI Product Manager who ships. Built Varity v0.1, an open-source Python package on PyPI with a novel Verdict Stability Score (VSS) metric for production-grade LLM self-checking. Shipped multiple products including an MCP Fairness Server and BookWise AI.", "charchitdhawan@gmail.com", "Remote / Global", "+91 8896 121 553", "", "charchitd", defaultHash]
            );
            console.log("Profile seeded.");
        }

        // --- EXPERIENCE TABLE ---
        await pool.query(`CREATE TABLE IF NOT EXISTS experience (
            id TEXT PRIMARY KEY,
            role TEXT,
            company TEXT,
            year TEXT,
            description TEXT
        )`);

        const expCount = await pool.query("SELECT count(*) as count FROM experience");
        if (parseInt(expCount.rows[0].count) === 0) {
            const experiences = [
                { id: "1", role: "Freelance AI Researcher & Product Builder", company: "Independent practice", year: "Jan 2026 – Present", description: "Built and shipped Varity v0.1 (open-source on PyPI) and an MCP fairness-governance server with six callable tools used live in client engagements. Designed agentic workflows in Claude Code." },
                { id: "2", role: "Technical Product Manager", company: "DailyDumbbell", year: "Sep 2022 – Jan 2024", description: "Owned product end-to-end: lifted retention by 25% by translating raw engagement data into a re-prioritized roadmap. Secured $200,000 in credit funding." },
                { id: "3", role: "Software Development Engineer (R&D)", company: "NeoSOFT Technologies", year: "Jul 2021 – Jul 2022", description: "Optimised SQL queries and backend architecture for a hospital management system serving 50K+ records — measured 30% transaction speed-up. Stack: MERN, REST API design." },
                { id: "4", role: "MSc Business Analytics", company: "Aston Business School", year: "2024 - 2025", description: "Merit / Distinction. Master's-level dissertation on LLM evaluation. Coursework: Predictive Analytics, Strategic Risk Management, Data-Driven Decision Making." }
            ];
            for (let exp of experiences) {
                await pool.query("INSERT INTO experience (id, role, company, year, description) VALUES ($1, $2, $3, $4, $5)",
                    [exp.id, exp.role, exp.company, exp.year, exp.description]);
            }
            console.log("Experience seeded.");
        }

        // --- PROJECTS TABLE ---
        await pool.query(`CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT,
            "techStack" TEXT,
            link TEXT,
            description TEXT
        )`);

        const projCount = await pool.query("SELECT count(*) as count FROM projects");
        if (parseInt(projCount.rows[0].count) === 0) {
            const projects = [
                { id: "p1", title: "Varity v0.1", techStack: "Python, LLMs, PyPI", link: "https://github.com/charchitd/varity", description: "Open-source PyPI package for LLM self-checking with a novel Verdict Stability Score (VSS) metric for measuring hallucination risk." },
                { id: "p2", title: "MCP Fairness Server", techStack: "Node.js, Claude Code, MCP", link: "#", description: "Built a Model Context Protocol server exposing six callable tools that operationalise AI fairness for recruitment systems." },
                { id: "p3", title: "Published Research — IEEE VTC 2020", techStack: "ML, Research, IEEE", link: "#", description: "Peer-reviewed publication on machine-learning models for vehicular network state prediction (35+ citations)." },
                { id: "p4", title: "BookWise AI", techStack: "Next.js, Supabase, Anthropic API", link: "#", description: "Full-stack LLM SaaS: PDF ingestion → AI curriculum generator → AI tutor chatbot." }
            ];
            for (let proj of projects) {
                await pool.query("INSERT INTO projects (id, title, \"techStack\", link, description) VALUES ($1, $2, $3, $4, $5)",
                    [proj.id, proj.title, proj.techStack, proj.link, proj.description]);
            }
            console.log("Projects seeded.");
        }

        // --- THOUGHTS TABLE ---
        await pool.query(`CREATE TABLE IF NOT EXISTS thoughts (
            id TEXT PRIMARY KEY,
            title TEXT,
            date TEXT,
            type TEXT,
            abstract TEXT,
            content TEXT
        )`);

        const thoughtCount = await pool.query("SELECT count(*) as count FROM thoughts");
        if (parseInt(thoughtCount.rows[0].count) === 0) {
            const thoughts = [
                {
                    id: "varity-vss",
                    title: "Introducing VSS: A Stability Metric for LLM Self-Checking",
                    date: "Jan 2026",
                    type: "paper",
                    abstract: "Measuring hallucination risk in production RAG pipelines using recursive self-checking and statistical stability analysis.",
                    content: "# Introducing VSS: A Stability Metric for LLM Self-Checking\n\nHallucination is the primary barrier to production LLM adoption. Varity v0.1 introduces the Verdict Stability Score (VSS) to quantify this risk."
                },
                {
                    id: "mcp-fairness",
                    title: "Operationalizing Fairness with Model Context Protocol",
                    date: "Nov 2025",
                    type: "blog",
                    abstract: "How we built an MCP server to let AI agents audit their own recruitment decisions for bias in real-time.",
                    content: "# Operationalizing Fairness with Model Context Protocol\n\nFairness shouldn't be an afterthought. By building a tool-calling interface for fairness audits, we can integrate guardrails directly into agentic workflows."
                }
            ];
            for (let t of thoughts) {
                await pool.query("INSERT INTO thoughts (id, title, date, type, abstract, content) VALUES ($1, $2, $3, $4, $5, $6)",
                    [t.id, t.title, t.date, t.type, t.abstract, t.content]);
            }
            console.log("Thoughts seeded.");
        }

        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

// Ensure database is initialized before first query (lazy, runs once)
const ensureInitialized = () => {
    if (!initPromise) {
        initPromise = initializeDatabase();
    }
    return initPromise;
};

module.exports = {
    query: async (text, params) => {
        await ensureInitialized();
        return pool.query(text, params);
    },
    pool: pool
};

