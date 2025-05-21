export class ToCHighlighter {
  static readonly TOC_ITEM_ID_PREFIX: string = "toc-item";

  static genToCItemId(slug: string): string {
    return `toc-${slug}`;
  }

  static observeHeadings(): void {
    // h1, h2要素を取得（idがある要素のみ）
    const headings = document.querySelectorAll<HTMLHeadingElement>('h1[id], h2[id]');
    // toc内の全てのli要素を取得
    const tocItems = document.querySelectorAll<HTMLLIElement>('.toc li');

    if (!headings.length || !tocItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      // 画面内に表示されている見出しを追跡
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      // 最も上にある見出しを特定
      const topEntry = visibleEntries.reduce((top, current) => {
        if (!top) return current;
        return current.boundingClientRect.top < top.boundingClientRect.top ? current : top;
      }, null as IntersectionObserverEntry | null);

      if (topEntry) {
        const id = topEntry.target.id;
        // ハイライトを更新
        tocItems.forEach(item => {
          const itemSlug = item.dataset.slug;
          if (itemSlug === id) {
            item.classList.add('highlighted');
          } else {
            item.classList.remove('highlighted');
          }
        });
      }
    }, {
      // 上部20%から下部60%までの範囲で判定
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 1],
    });

    // 各見出しの監視を開始
    headings.forEach(heading => observer.observe(heading));
  }
}
