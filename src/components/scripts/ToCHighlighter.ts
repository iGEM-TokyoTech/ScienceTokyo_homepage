export function ToCHighlighter(
  tocItemSelector: string = '.toc li',
  headingSelector: string = 'h1[id], h2[id]',
  highlightClassName: string = 'highlighted',
  scrollOffset: number = 80
): void {
  // DOMが読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', () => {
    const tocItems = Array.from(document.querySelectorAll(tocItemSelector));
    const headings = Array.from(document.querySelectorAll<HTMLElement>(headingSelector));

    // 対象要素がなければ何もしない
    if (!tocItems.length || !headings.length) {
      return;
    }

    const onScroll = () => {
      let currentId: string | null = null;

      // 現在のスクロール位置に最も近い見出しIDを探す
      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= scrollOffset) {
          currentId = heading.id;
        }
      }

      // ToCの各項目に対してハイライトを付け外しする
      tocItems.forEach(item => {
        // HTMLElementでない可能性を考慮
        if (!(item instanceof HTMLElement) || !item.dataset.slug) {
          return;
        }

        if (item.dataset.slug === currentId) {
          item.classList.add(highlightClassName);
        } else {
          item.classList.remove(highlightClassName);
        }
      });
    };

    // スクロールイベントに登録
    window.addEventListener('scroll', onScroll, { passive: true });

    // ページ読み込み時に一度実行して初期状態を設定
    onScroll();
  });
}