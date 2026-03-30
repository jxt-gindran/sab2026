import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

// Initialize Convex Client
// We need the NEXT_PUBLIC_CONVEX_URL or VITE_CONVEX_URL
const convex = new ConvexHttpClient(
  process.env.VITE_CONVEX_URL || "https://limitless-dragon-854.convex.cloud"
);

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send("Missing slug");
  }

  try {
    // Fetch cyclist from Convex
    // Wait, we need to pass the shareSlug, but we don't have the api object imported correctly
    // Let's just use the hardcoded path "cyclists:getBySlug" or whatever it is
    const cyclist = await convex.query(api.cyclists.getBySlug, { shareSlug: slug });

    if (!cyclist) {
      return res.status(404).send("Cyclist not found");
    }

    // Build the fallback HTML for crawlers
    const title = `Support ${cyclist.name} | SAB 2026`;
    const description = `${cyclist.name} is riding 680KM across Borneo to raise RM ${cyclist.goal.toLocaleString()} for life-saving paediatric care.`;
    const imageUrl = cyclist.profileUrl || "https://sab2026.com/assets/logos/SABFavicon.png";
    const url = `https://sab2026.com/riders/${slug}`; // Update with real domain if available

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${description}" />
    
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
    
    <!-- Redirect for users visiting the crawler page (fallback) -->
    <script>
      window.location.replace("/riders/${slug}");
    </script>
</head>
<body>
    <h1>${title}</h1>
    <p>${description}</p>
    <img src="${imageUrl}" alt="${cyclist.name}" />
    <p>If you are not redirected automatically, <a href="/riders/${slug}">click here</a>.</p>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(html);

  } catch (error) {
    console.error("Error fetching cyclist for OG tags:", error);
    return res.status(500).send("Internal Server Error");
  }
}
