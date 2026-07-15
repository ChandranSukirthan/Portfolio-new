/**
 * Downloads a file from a URL or Data URI.
 * Uses fetch + Blob URL to bypass browser pop-up blockers (about:blank#blocked).
 *
 * @param {string} url       The URL or Data URI to download
 * @param {string} fileName  The suggested filename for the download
 */
export const downloadFile = async (url, fileName = "Resume.pdf") => {
  if (!url || url === "#") return;

  try {
    if (url.startsWith("data:")) {
      // ── Case 1: Data URI (base64) ──────────────────────────────────────
      const parts = url.split(",");
      const mimeType = parts[0].match(/:(.*?);/)[1];
      const byteCharacters = atob(parts[1]);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } else {
      // ── Case 2: Normal URL (http/https or relative) ────────────────────
      // Fetch the file as a blob to avoid the "about:blank#blocked" pop-up
      // blocker that triggers when programmatically opening a new tab.
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.error("Download failed, falling back to direct link:", err);
    // Last-resort fallback: direct navigation (stays on same tab)
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Safely previews/views a file (including Base64 Data URIs) in a new tab
 * by converting Base64 to Blob URLs to bypass browser security restrictions.
 *
 * @param {string} url The URL or Data URI to view
 */
export const viewFile = (url) => {
  if (!url || url === "#") return;

  // Case 1: Data URI (base64)
  if (url.startsWith("data:")) {
    try {
      const parts = url.split(",");
      const mimeType = parts[0].match(/:(.*?);/)[1];
      const byteCharacters = atob(parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (e) {
      console.error("Error opening data URI:", e);
      window.open(url, "_blank");
    }
    return;
  }

  // Case 2: Normal URL
  window.open(url, "_blank", "noopener,noreferrer");
};
