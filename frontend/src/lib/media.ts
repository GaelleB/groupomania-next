const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_BASE_URL = API_URL.replace(/\/api\/?$/, '');

export const resolveImageUrl = (rawPath?: string | null) => {
  if (!rawPath) {
    return null;
  }

  if (/^https?:\/\//i.test(rawPath)) {
    return rawPath;
  }

  const trimmed = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  if (API_BASE_URL) {
    return `${API_BASE_URL}${trimmed}`;
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${trimmed}`;
  }

  return trimmed;
};
