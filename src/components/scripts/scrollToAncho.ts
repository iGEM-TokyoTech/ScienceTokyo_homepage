// src/utils/scrollToAnchor.ts

/**
 * 指定したアンカーへ、オフセット分ずらしてスムーススクロール
 * @param href 例 "#section1"
 * @param offset 上からのオフセット (px)。デフォルト80
 */
export function scrollToAnchor(href: string, offset: number = 80): void {
  if (!href.startsWith("#")) return;
  const id = href.slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
  history.replaceState(null, "", href);
}

