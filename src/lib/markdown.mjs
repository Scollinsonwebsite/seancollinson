// Minimal Markdown → HTML for blog posts: ## headings, paragraphs (a single
// newline inside a paragraph becomes <br>), "- " lists, **bold**, *italic*,
// and [text](url) links. Text is HTML-escaped; nothing else is supported.
import { esc } from './render.mjs';

const inline = (s) =>
  esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const internal = /^https:\/\/seancollinson\.com(\/|$)/.test(u);
      const href = internal ? u.replace(/^https:\/\/seancollinson\.com/, '') || '/' : u;
      return internal || href.startsWith('/')
        ? `<a href="${href}">${t}</a>`
        : `<a href="${href}" target="_blank" rel="noopener">${t}<span class="visually-hidden"> (opens in a new tab)</span></a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

export function markdown(src) {
  return src
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const h = block.match(/^(#{2,4}) (.+)$/);
      if (h) return `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`;
      if (/^- /.test(block)) return `<ul>${block.split('\n').map((l) => `<li>${inline(l.replace(/^- /, ''))}</li>`).join('')}</ul>`;
      return `<p>${block.split('\n').map(inline).join('<br>')}</p>`;
    })
    .join('\n');
}
