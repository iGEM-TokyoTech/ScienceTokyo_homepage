export class ToCHighlighter {
  private static tocs: HTMLUListElement[] | null = null;
  private static toc: boolean = false;

  /**
   * 対応する目次のDOM要素のIDを生成する
   * e.g. "slug" → "toc-slug"
   */
  static genToCItemId(slug: string): string {
    return `toc-${slug}`;
  }

  /**
   * ページ内の <h1> 要素を監視して、スクロールに応じて目次をハイライト
   */
  static observeHeadings(): void {
    const headings = document.querySelectorAll<HTMLHeadingElement>("h1[id]");
    const tocItems = document.querySelectorAll<HTMLElement>(".depth1");

    if (headings.length === 0 || tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 最上部に最も近い intersecting 要素を探す
        let currentId: string | null = null;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            currentId = entry.target.id;
            break;
          }
        }

        tocItems.forEach((item) => {
          const slug = item.dataset.slug;
          if (slug === currentId) {
            item.classList.add("highlighted");
          } else {
            item.classList.remove("highlighted");
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px", // 下方向に80%早めに判定
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => observer.observe(heading));
  }

  /**
   * ToCの設定を行う
   */
  static setToC(): ToCHighlighter {
    this.toc = true;
    if (this.tocs === null) {
      this.tocs = Array.from(
        document.querySelectorAll<HTMLUListElement>("ul.toc")
      );
    }
    return this;
  }
}