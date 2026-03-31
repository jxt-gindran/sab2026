export default function handler(req: any, res: any) {
  const { path } = req.query;
  const requestPath = path ? `/${path}` : "/";

  // Default values
  let title = "Sepeda Amal Borneo 2026";
  let description = "A 660km charity cycling expedition across Borneo funding life-saving paediatric surgeries and immune deficiency treatment. Organized by MMA Foundation.";
  let imageUrl = "https://sab2026.com/assets/images/sabcyclist.jpg";

  // Customize based on path
  if (requestPath.startsWith("/mission")) {
    title = "Our Mission | SAB 2026";
    description = "Learn about our mission to fund life-saving paediatric care in Sarawak through a 660km cycling expedition.";
    imageUrl = "https://sab2026.com/assets/images/pediatric-surgery.webp";
  } else if (requestPath.startsWith("/legacy")) {
    title = "Our Legacy | SAB 2026";
    description = "Building on the success of SAB 2024, our legacy continues as we cycle across Borneo for paediatric healthcare.";
  } else if (requestPath.startsWith("/ride")) {
    title = "The Ride | SAB 2026";
    description = "Explore the 680km route from Kota Kinabalu to Miri. Meet the dedicated cyclists undertaking the Sepeda Amal Borneo challenge.";
    imageUrl = "https://sab2026.com/assets/images/map-route.webp";
  } else if (requestPath.startsWith("/donate")) {
    title = "Donate | SAB 2026";
    description = "Support the Sepeda Amal Borneo expedition. Your donation directly funds life-saving paediatric care and immune deficiency treatments.";
  } else if (requestPath.startsWith("/contact") || requestPath.startsWith("/faq")) {
    title = "Contact & FAQ | SAB 2026";
  }

  const url = `https://sab2026.com${requestPath}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
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
    
    <script>
      // Automatically redirect to the actual frontend path (with ?loaded=true to prevent loop if same URL)
      // The crawler doesn't execute JS, so it reads the tags above. Humans hitting this directly get redirected.
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.has('loaded')) {
        let redirectPath = "${requestPath}";
        if (redirectPath.includes('?')) {
            redirectPath += "&loaded=true";
        } else {
            redirectPath += "?loaded=true";
        }
        window.location.replace(redirectPath);
      }
    </script>
</head>
<body>
    <div class="loader"></div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).send(html);
}
