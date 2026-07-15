import { getBackendBase } from "../api/api";

/**
 * Downloads a file by routing it through the backend proxy (/api/download)
 * so that CORS restrictions and browser popup-blockers (about:blank#blocked)
 * are completely avoided.
 *
 * @param {string} url       The original file URL or Data URI
 * @param {string} fileName  The suggested filename for the download
 */
export const downloadFile = async (url, fileName = "Resume.pdf") => {
  if (!url || url === "#") return;

  try {
    let fetchUrl;

    if (url.startsWith("data:")) {
      // ── Case 1: Data URI – convert to blob directly, no fetch needed ──
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
      return;
    } else if (url.startsWith("http://") || url.startsWith("https://")) {
      // ── Case 2: External URL (Cloudinary, etc.) ───────────────────────
      // Route through our own backend proxy to avoid CORS + popup-blocker.
      const backendBase = getBackendBase();
      fetchUrl = `${backendBase}/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(fileName)}`;
    } else {
      // ── Case 3: Relative URL (local backend /uploads/...) ─────────────
      const backendBase = getBackendBase();
      fetchUrl = `${backendBase}/api/download?url=${encodeURIComponent(`${backendBase}${url}`)}&name=${encodeURIComponent(fileName)}`;
    }

    // Fetch via our proxy – same origin so no CORS issues
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`Proxy fetch failed: ${response.status}`);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed:", err);
    // Last resort: navigate directly (same tab, no popup)
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
