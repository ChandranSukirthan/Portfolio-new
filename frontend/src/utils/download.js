/**
 * Safely downloads a file (including Base64 Data URIs) without opening new tabs
 * that might get blocked by browser security (about:blank#blocked).
 * 
 * @param {string} url The URL or Data URI to download
 * @param {string} fileName The name to save the file as
 */
export const downloadFile = async (url, fileName = "Resume.pdf") => {
  if (!url || url === "#") return;

  // Case 1: Data URI (base64)
  if (url.startsWith("data:")) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Case 2: Normal URL
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.warn("Failed to download via fetch, falling back to window.open:", error);
    // Fallback: Open in new tab (browsers won't block HTTP/HTTPS urls, only data: urls)
    window.open(url, "_blank", "noopener,noreferrer");
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
