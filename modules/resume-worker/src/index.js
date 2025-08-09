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

      // Return the PDF
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
