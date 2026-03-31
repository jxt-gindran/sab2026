import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

// Initialize Convex Client using the same URL Vite uses
const convex = new ConvexHttpClient(
  process.env.VITE_CONVEX_URL || "https://limitless-dragon-854.convex.cloud" // Check build env
);

export default async function handler(req: any, res: any) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send("Missing slug");
  }

  try {
    // Fetch cyclist from Convex
    const cyclist = await convex.query(api.cyclists.getBySlug, { shareSlug: slug });

    if (!cyclist) {
      // If no cyclist exists, just serve the normal app fallback (React will show 404)
      return res.redirect(302, `/?notfound=true`);
    }

    // Build the fallback HTML for crawlers and humans
    const title = `Support ${cyclist.name} | SAB 2026`;
    const description = `${cyclist.name} is riding 680KM across Borneo to raise RM ${cyclist.goal.toLocaleString()} for life-saving paediatric care.`;
    
    let imageUrl = cyclist.profileUrl || "https://sab2026.com/assets/images/sabcyclist.jpg";
    if (imageUrl.startsWith("/")) {
      imageUrl = `https://sab2026.com${imageUrl}`;
    }
    
    const url = `https://sab2026.com/riders/${slug}`; 

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${url}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${imageUrl}" />
    <style>
      body { background-color: #013254; overflow: hidden; }
      .loader {
         position: fixed; top: 50%; left: 50%; width: 48px; border-radius: 50%;
         transform: translate(-50%, -50%); border: 4px solid #0cdfed; border-top-color: transparent;
         animation: spin 1s linear infinite; height: 48px;
      }
      @keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
    </style>
    
    <!-- Redirect to HashRouter syntax if the app is purely SPA.
         But since we upgraded to BrowserRouter, we just redirect back to the app with a query param signaling it's a SPA load,
         Or actually, redirecting to /riders/${slug} infinitely loops!
         Ah! To avoid infinite loop, we add ?ssr=false -->
    <script>
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.has('loaded')) {
        // Use history.replaceState to trick the SPA router instead of hard redirecting if possible
        // Actually, just redirecting to /?route=/riders/${slug} is safer, 
        // Then App.tsx handles redirect. Or just redirect to /riders/${slug}?loaded=true
        window.location.replace("/riders/${slug}?loaded=true");
      }
    </script>
</head>
<body>
    <div class="loader"></div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour at edge
    return res.status(200).send(html);

  } catch (error) {
    console.error("Error fetching cyclist for OG tags:", error);
    // Fallback to normal app
    return res.redirect(302, `/?error=true`);
  }
}
