import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function fixImageUrl(url: any): string | undefined {
    if (!url) return undefined;
    if (typeof url !== 'string') return undefined;

    // Handle encoded colon
    let processedUrl = url.replace('%3A', ':');

    // Check for double prefixing (e.g. /media/https:// or /media/https:/)
    if (processedUrl.includes('/media/http')) {
        return 'http' + processedUrl.split('/media/http')[1];
    }

    // Handle specific case from logs: /media/https:/
    if (processedUrl.includes('/media/https:/')) {
        return 'https://' + processedUrl.split('/media/https:/')[1];
    }

    // Handle Django returning absolute URLs that get prefixed
    if (url.startsWith('http')) return url;

    // Handle relative URLs from Django (media files)
    if (url.startsWith('/')) {
        let baseUrl = import.meta.env.VITE_API_URL || '';
        // Remove /api if present at the end
        baseUrl = baseUrl.replace(/\/api\/?$/, '');

        // If still empty, we have no base URL, return as is or use a safe fallback
        if (!baseUrl) return url;

        // Ensure no trailing slash on baseUrl before joining
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBaseUrl}${url}`;
    }

    return url;
}
