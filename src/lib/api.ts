/**
 * Utility to normalize API URLs and prevent double /api/api issues.
 */
export function getApiUrl(path: string): string {
    // 1. Get the base URL from env or fallback
    let base = process.env.NEXT_PUBLIC_API_URL || "https://percepta-backend.onrender.com";
    
    // 2. Normalize: Remove a trailing /
    base = base.replace(/\/$/, "");
    
    // 3. Prevent /api duplication: 
    // If the base ALREADY includes /api, and the path starts with /api, strip it from the base.
    if (base.endsWith("/api") && path.startsWith("/api")) {
        base = base.substring(0, base.length - 4);
    }
    
    // 4. Ensure path starts with /
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    return `${base}${cleanPath}`;
}
