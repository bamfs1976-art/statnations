import { useEffect } from 'react';

const SITE = 'https://sportstatnations.netlify.app';

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.property ? 'meta' : selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) { if (el) el.remove(); return; }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Per-page head management: title, description, canonical, Open Graph and
 * optional JSON-LD. Kept as a tiny effect rather than pulling in a head library.
 */
export default function SEO({ title, description, path = '/', image = '/og-image.png', jsonLd }) {
  useEffect(() => {
    if (title) document.title = title;
    const url = SITE + path;
    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description });
      upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
      upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    }
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: url });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title || 'StatNations' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: SITE + image });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title || 'StatNations' });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: SITE + image });
    upsertJsonLd('sn-page-jsonld', jsonLd);
  }, [title, description, path, image, jsonLd]);

  return null;
}
