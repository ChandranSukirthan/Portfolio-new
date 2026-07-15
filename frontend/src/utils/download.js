export const downloadFile = (url, fileName = "Resume.pdf") => {
  if (!url || url === "#") return;

  const link = document.createElement("a");
  link.href = url;

  // Case 1: Data URI (base64)
  if (url.startsWith("data:")) {
    // For Data URIs, do NOT use target="_blank" to prevent about:blank#blocked
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Case 2: Normal URL
    // Open in a new tab/window to prevent taking the user away from the site,
    // and let the browser display the PDF resume file natively.
    link.target = "_blank";
    link.rel = "noopener noreferrer";
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
      // Parse base64 data URI
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
      // Fallback: try opening in a new tab directly (will probably be blocked but is a last resort)
      window.open(url, "_blank");
    }
    return;
  }

  // Case 2: Normal URL
  window.open(url, "_blank", "noopener,noreferrer");
};
