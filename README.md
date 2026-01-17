# Utility Tools Website

A production-ready, SEO-friendly utility tools website designed for Google AdSense approval and passive income generation.

## Features

- **PDF Tools**: Compress, Merge, Convert to Image
- **Resume Tools**: ATS Checker, Resume Formatter
- **Developer Tools**: JSON Formatter, JWT Decoder
- **SEO Optimized**: Schema markup, sitemap, meta tags
- **Fully Responsive**: Mobile, tablet, desktop
- **Fast Loading**: Core Web Vitals optimized
- **AdSense Ready**: Compliant layout and required pages

## Tech Stack

- HTML5 (Semantic)
- CSS3 (Tailwind CSS via CDN)
- Vanilla JavaScript
- PDF.js for PDF processing
- Client-side processing (privacy-friendly)

## Project Structure

```
/
├── index.html                    # Homepage
├── pdf-tools/                   # PDF tools section
├── resume-tools/                # Resume tools section
├── dev-tools/                   # Developer tools section
├── blog/                        # Blog articles
├── pages/                       # Static pages (About, Contact, etc.)
├── assets/                      # CSS, JS, images
└── sitemap.xml                  # SEO sitemap
```

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### Netlify

1. Drag and drop the project folder to Netlify dashboard
2. Or use Netlify CLI: `netlify deploy --prod`

### GitHub Pages

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch

## Local Development

1. Clone the repository
2. Open `index.html` in a browser or use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve .
   ```

## SEO Features

- Semantic HTML5 structure
- Meta tags (title, description, Open Graph, Twitter)
- Schema markup (FAQ, SoftwareApplication)
- Sitemap.xml
- Internal linking
- Optimized images with lazy loading

## AdSense Compliance

- About page
- Contact page
- Privacy Policy
- Terms of Service
- Clear content purpose
- No misleading content
- Proper ad placement zones

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Free to use and modify
