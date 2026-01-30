import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function fixImageUrl(url: string | null | undefined): string | undefined {
    if (!url) return undefined;

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
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';
        return `${baseUrl}${url}`;
    }

    return url;
}
