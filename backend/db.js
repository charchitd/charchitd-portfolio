const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// The free Neon tech postgres connection string
const connectionString = "postgresql://neondb_owner:npg_YoUMKNmi71Fy@ep-late-feather-absup3ii-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
    connectionString,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to Neon PostgreSQL database.');
    release();
    initializeDatabase();
});

const initializeDatabase = async () => {
    try {
        // Create Profile Table
        await pool.query(`DROP TABLE IF EXISTS profile`);
        await pool.query(`CREATE TABLE profile (
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

        console.log("Migrating DB: Checking for passwordHash");
        const profileCols = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='profile' and column_name='passwordHash'
        `);
        // Note: PostgreSQL column names are converted to lowercase unless quoted. We'll add it if missing.
        // But since we use camelCase in queries, it's safer to just alter if there's an error later, or standardize on lowercase
        // In Postgres, if we didn't quote "passwordHash", it became passwordhash.

        // Seed initial profile only if empty
        const profileCountResult = await pool.query("SELECT count(*) as count FROM profile");
        if (parseInt(profileCountResult.rows[0].count) === 0) {
            const defaultHash = bcrypt.hashSync('admin123', 10);
            await pool.query(`INSERT INTO profile (id, name, title, bio, email, location, phone, image, "githubAuthUser", "passwordHash") 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [1, "Charchit Dhawan", "AI Researcher & Tech Product Specialist", "I specialize in cutting-edge AI research, machine learning models, and building tech products that shape the future. Bridging the gap between deep technical research and scalable user-centric products.", "charchitdhawan@gmail.com", "Active globally", "Available upon request", "", "charchitdhawan", defaultHash]
            );
        }

        // Create Experience Table
        await pool.query(`CREATE TABLE IF NOT EXISTS experience (
            id TEXT PRIMARY KEY,
            role TEXT,
            company TEXT,
            year TEXT,
            description TEXT
        )`);

        const expCountResult = await pool.query("SELECT count(*) as count FROM experience");
        if (parseInt(expCountResult.rows[0].count) === 0) {
            const experiences = [
                { id: Date.now().toString(), role: "AI Researcher", company: "Research Labs", year: "2023 - Present", description: "Leading research on generative models and their alignment with human intent." },
                { id: (Date.now() + 1).toString(), role: "Product Manager", company: "Tech Startup Inc.", year: "2021 - 2023", description: "Managed the lifecycle of an AI-driven SaaS platform, growing user base by 300%." }
            ];
            for (let exp of experiences) {
                await pool.query("INSERT INTO experience (id, role, company, year, description) VALUES ($1, $2, $3, $4, $5)",
                    [exp.id, exp.role, exp.company, exp.year, exp.description]);
            }
        }

        // Create Projects Table
        await pool.query(`CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT,
            techStack TEXT,
            link TEXT,
            description TEXT
        )`);

        const projCountResult = await pool.query("SELECT count(*) as count FROM projects");
        if (parseInt(projCountResult.rows[0].count) === 0) {
            const projects = [
                { id: Date.now().toString(), title: "Nexus Agent Shell", techStack: "Python, PyTorch, React", link: "https://github.com", description: "An intelligent terminal assistant that predicts workflow commands using local sparse LLMs." },
                { id: (Date.now() + 1).toString(), title: "Gen-Z Ecom Platform", techStack: "Next.js, Node.js, Stripe", link: "https://github.com", description: "A high-conversion headless e-commerce frontend tailored for modern Gen-Z brands." }
            ];
            for (let proj of projects) {
                await pool.query("INSERT INTO projects (id, title, techStack, link, description) VALUES ($1, $2, $3, $4, $5)",
                    [proj.id, proj.title, proj.techStack, proj.link, proj.description]);
            }
        }

        // Create Thoughts Table
        await pool.query(`CREATE TABLE IF NOT EXISTS thoughts (
            id TEXT PRIMARY KEY,
            title TEXT,
            date TEXT,
            type TEXT,
            abstract TEXT,
            content TEXT
        )`);

        const thoughtCountResult = await pool.query("SELECT count(*) as count FROM thoughts");
        if (parseInt(thoughtCountResult.rows[0].count) === 0) {
            const thoughts = [
                {
                    id: "gen-ai-comp-bio",
                    title: "Generative AI in Computational Biology: A New Frontier",
                    date: "Oct 2024",
                    type: "paper",
                    abstract: "Exploring the applications of large language models in predicting protein folding and gene expression with high accuracy using attention mechanisms.",
                    content: "# Generative AI in Computational Biology: A New Frontier\n\nComputational biology has seen a massive paradigm shift. Just like we map words into tokens to train LLMs, we are now tokenizing DNA, RNA, and protein structures.\n\n### The Research Perspective\nGenerative architectures, particularly Transformers, excel at modeling the intricate, multi-dimensional dependencies found in genetic sequences. Methods inspired by AlphaFold have proven that scaling attention mechanisms across vast biological datasets can lead robust, accurate predictions of complex 3D molecular structures.\n\n### The Tech Product Perspective\nFrom a product standpoint, creating a viable SaaS for drug discovery is the holy grail. Researchers working in wet labs historically spent years trying to synthesize potential leads. Now, an elegant UI backed by an inference API can narrow down millions of candidate molecules to the top 10 within days. The product challenge isn't just the AI—it's building the platform pipelines to support secure, specialized enterprise and academic teams without breaching data silos. A successful biotech SaaS masks the immense complexity of the underlying compute, providing a clean \"upload data -> get insights\" loop."
                },
                {
                    id: "latent-space-diffusion",
                    title: "Understanding Latent Space in Diffusion Models",
                    date: "Aug 2024",
                    type: "blog",
                    abstract: "A deep dive into how changing constraints in the latent space affects the generation of coherent vs abstract image constructs.",
                    content: "# Understanding Latent Space in Diffusion Models\n\nDiffusion models are the current state-of-the-art for visual generation, owing their success to forward and reverse denoising processes within a compressed \"latent\" space.\n\n### The Research Perspective\nWorking with pixel space directly is computationally intractable for ultra-high-resolution images. By mapping images into a lower-dimensional latent representation, we can iteratively denoise representations effectively. The mathematical elegance here lies in stochastic differential equations (SDEs) where we guide the denoising trajectory using text or image embeddings.\n\n### The Tech Product Perspective\nFor end users, latent space means nothing. They want absolute control. The explosion of tools like Midjourney or enterprise equivalents relies on offering hyper-specific control to artists and marketing teams. The product challenge is abstracting vectors—like LoRAs (Low-Rank Adaptations) or ControlNets—into intuitive sliders and buttons. Can we give a graphic designer the ability to consistently generate a brand's mascot across environments? Features like \"consistent character persistence\" and \"inpainting workflows\" are what transform an impressive AI demo into a million-dollar MRR (Monthly Recurring Revenue) business."
                },
                {
                    id: "sparse-attention",
                    title: "Efficiency Gains from Sparse Attention Architectures",
                    date: "Jun 2024",
                    type: "paper",
                    abstract: "We introduce a novel sparse attention technique that reduces the O(N^2) complexity to O(N log N) without compromising model performance.",
                    content: "# Efficiency Gains from Sparse Attention Architectures\n\nThe self-attention mechanism is a quadratic bottleneck. As sequence length $N$ grows, memory and compute scale at $O(N^2)$.\n\n### The Research Perspective\nExtending the context window of models from 4k tokens to 1 Million tokens requires fundamental architectural changes. Sparse attention patterns—where tokens only attend to a subset of preceding tokens (e.g., using sliding windows or dilated attention)—drastically reduce compute needs. Our recent experiments validate that keeping dense attention on the most recent tokens while applying highly sparse attention globally allows models to maintain almost perfectly coherent long-form reasoning.\n\n### The Tech Product Perspective\nWhy does $O(N^2)$ matter to a Product Manager? **Unit Economics.** If your AI startup burns $0.05 per API call, your margins are razor-thin. Sparse architectures unlock lower inference costs and lower latency for the end user. When a user uploads a 100-page PDF to your platform, they expect a response in 3 seconds, not 30. Better hardware utilization opens the door to localized, consumer-grade models running on edge devices (like smartphones), revolutionizing privacy-first AI products."
                },
                {
                    id: "ethics-in-ai",
                    title: "Ethics in AI: Bias Mitigation Strategies",
                    date: "Mar 2024",
                    type: "blog",
                    abstract: "Why modern datasets fail representation metrics and what we can do to mathematically ensure fairness in our training loops.",
                    content: "# Ethics in AI: Bias Mitigation Strategies\n\nAs AI models become ubiquitous, their inherent biases—learned straight from unfiltered human datasets on the internet—become societal liabilities.\n\n### The Research Perspective\nBias mitigation cannot be solely an afterthought. It must be integrated into the loss function during pre-training and alignment phases (like RLHF - Reinforcement Learning from Human Feedback or Constitutional AI). We are researching methods to automatically quantify biases in embedding spaces. If the vector distance between \"doctor\" and \"man\" is drastically smaller than \"doctor\" and \"woman\", the foundational embedding needs re-weighting.\n\n### The Tech Product Perspective\nTrust and Safety (T&S) is not just a regulatory compliance check—it is a core Unique Selling Proposition (USP). Enterprise clients will not deploy customer-facing chatbots if there is a 1% chance it generates biased or offensive content resulting in brand damage. Building products that provide interpretable audit logs, hallucination checks, and configurable brand-safety guardrails is exactly what differentiates an enterprise-grade AI software suite from a wrapper around OpenAI's APIs. Good ethics is good business."
                }
            ];
            for (let t of thoughts) {
                await pool.query("INSERT INTO thoughts (id, title, date, type, abstract, content) VALUES ($1, $2, $3, $4, $5, $6)",
                    [t.id, t.title, t.date, t.type, t.abstract, t.content]);
            }
        }

        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool
};
