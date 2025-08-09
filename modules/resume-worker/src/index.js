export default {
  async fetch(req, env) {
    try {
      const url = new URL(req.url);

      // Expect URLs like /resume/Abhay_resume_2025.pdf
      if (!url.pathname.startsWith("/resume/")) {
        return new Response("Invalid path", { status: 400 });
      }

      // Remove the `/resume/` prefix
      const key = url.pathname.replace(/^\/resume\//, "");

      if (!key) {
        return new Response("File key required", { status: 400 });
      }

      // Get the file from R2
      const object = await env.MY_BUCKET.get(key);
      if (!object) {
        return new Response("File not found", { status: 404 });
      }

      // Check for the `prompt` query parameter
      const prompt = url.searchParams.get("prompt");
      if (prompt) {
        const apiUrl = "https://live-cv-byk0.onrender.com/convert";
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pdfUrl: `https://media.bythub.shop/${key}`, // Replace with actual R2 storage URL
            prompt: prompt
          })
        });

        if (!response.ok) {
          return new Response("Error converting file", { status: response.status });
        }

        const convertedPdf = await response.blob();

        // Generate a random string for the new key
        const randomString = Math.random().toString(36).substring(2, 8);
        const newKey = `converted_${randomString}_${key}`;

        // Save the converted PDF to R2 storage
        await env.MY_BUCKET.put(newKey, convertedPdf, {
          httpMetadata: {
            contentType: "application/pdf"
          }
        });

        // Redirect to the new path
        return new Response(null, {
          status: 302,
          headers: {
            Location: `https://bythub.shop/resume/${newKey}`
          }
        });
      }

      // Return the original PDF
      return new Response(object.body, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${key}"`
        }
      });
    } catch (err) {
      return new Response("Error fetching file: " + err.message, { status: 500 });
    }
  }
};
