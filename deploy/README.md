# Charchit Dhawan - Portfolio Website

A modern, responsive portfolio website for a researcher in Responsible AI, Fairness, and Transparency.

## Features

- **Modern Design**: Dark theme with coral accent colors, editorial typography
- **Smooth Animations**: CSS-based scroll animations using Intersection Observer
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Sections**:
  - Hero with portrait and introduction
  - Research Pillars (Fairness, Transparency, Accountability)
  - Philosophy statement
  - Selected Work (Projects & Publications)
  - Collaborators showcase
  - Experience Timeline
  - Capabilities & Skills
  - Writing/Blog section
  - Contact section

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

## GitHub Pages Deployment

### Option 1: Deploy from `gh-pages` branch

1. Create a new repository on GitHub
2. Push this code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

3. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

4. Add to `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

5. Deploy:
   ```bash
   npm run deploy
   ```

### Option 2: Deploy from `main` branch (GitHub Actions)

1. Push code to GitHub
2. Go to repository Settings → Pages
3. Source: GitHub Actions
4. Use the provided Vite workflow

### Option 3: Manual Upload

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Select `main` branch and `/ (root)` folder
5. Upload the contents of the `dist` folder directly

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

- Edit content in `src/sections/` files
- Update images in `public/images/`
- Modify colors in `src/index.css` and `tailwind.config.js`
- Update personal information in each section component

## License

MIT License - feel free to use this template for your own portfolio!
