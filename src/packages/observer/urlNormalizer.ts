/**
 * Pheebs Core - Genesis Observer Package
 * URL Normalizer & Short Link Resolver
 */

export interface NormalizedUrlResult {
  normalizedUrl: string;
  isGoogleMapsUrl: boolean;
  businessSlugOrName: string;
  rawInput: string;
}

export function normalizeGoogleMapsUrl(inputUrl: string): NormalizedUrlResult {
  const trimmed = inputUrl.trim();
  
  if (!trimmed) {
    throw new Error('URL input cannot be empty');
  }

  // Handle URL normalization
  let cleaned = trimmed;
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }

  const isMaps = cleaned.includes('google.com/maps') || 
                 cleaned.includes('g.page') || 
                 cleaned.includes('maps.app.goo.gl') || 
                 cleaned.includes('g.co/maps');

  let slug = '';
  try {
    const parsed = new URL(cleaned);
    
    if (parsed.pathname.includes('/place/')) {
      const match = parsed.pathname.match(/\/place\/([^\/]+)/);
      if (match && match[1]) {
        slug = decodeURIComponent(match[1].replace(/\+/g, ' '));
      }
    } else if (parsed.searchParams.has('q')) {
      slug = parsed.searchParams.get('q') || '';
    } else {
      // Fallback: extract hostname or first path segment
      slug = parsed.hostname.replace('www.', '');
    }
  } catch (e) {
    slug = cleaned.replace(/^https?:\/\//, '').split('/')[0];
  }

  return {
    normalizedUrl: cleaned,
    isGoogleMapsUrl: isMaps,
    businessSlugOrName: slug || 'Unknown Business',
    rawInput: inputUrl
  };
}
