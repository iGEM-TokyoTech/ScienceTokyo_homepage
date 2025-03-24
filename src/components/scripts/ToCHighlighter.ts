/**
 * sectionizer -> TabManage -> ToCHighlighter
 */
export class ToCHighlighter {
    observer: IntersectionObserver;
    highlighted: Element | null = null;
    tocItems: HTMLLIElement[];
    keyToCItemMap: { [key: string]: HTMLLIElement } = {};
    private highlightedSection: Element | null = null;
    private highlifhtedSecHeight: number = 0;
    static readonly OBSERVED_CLASS: string = "__toc-observed";
    static readonly OBSERVED_SELECTOR: string = `.${ToCHighlighter.OBSERVED_CLASS}`;
    static readonly TOC_ITEM_ID_PREFIX: string = "toc-item";
  
    static genToCItemId(slug: string): string {
      return `${ToCHighlighter.TOC_ITEM_ID_PREFIX}-${slug}`;
    }
  
    /**
     *
     * @param tocs all `ToC`
     */
    constructor(tocs: HTMLUListElement[]) {
      this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
        root: null, // viewport
        rootMargin: "0px",
        threshold: Array.from(Array(101), (_, i) => i / 100), // 0% to 100% thresholds
      });
  
      this.tocItems = [];
  
      tocs.forEach((toc) => {
        this.tocItems = this.tocItems.concat(
          Array.from(toc.querySelectorAll<HTMLLIElement>(":scope > li")),
        );
      });
  
      this.createMap();
    }
  
    private createMap(): void {
      this.tocItems.forEach((tocItem) => {
        /**
         * slug MUST be unique because tocItem's slug has tab prefix
         *
         * ref: ToC.astro
         */
        this.keyToCItemMap[tocItem.dataset.slug!] = tocItem;
      });
    }
  
    public init() {
      const sections = document.querySelectorAll(
        ToCHighlighter.OBSERVED_SELECTOR,
      );
      sections.forEach((section) => this.observer.observe(section));
    }
  
    private handleIntersect(entries: IntersectionObserverEntry[]) {
      let maxRatioEnt: IntersectionObserverEntry | null = null;
      let maxHeight = 0;
  
      for (const ent of entries) {
        if (maxHeight < ent.intersectionRect.height) {
          maxHeight = ent.intersectionRect.height;
          maxRatioEnt = ent;
        }
  
        if (ent.target === this.highlightedSection) {
          this.highlifhtedSecHeight = ent.intersectionRect.height;
        }
      }
  
      if (maxRatioEnt && maxHeight > this.highlifhtedSecHeight) {
        const sec = maxRatioEnt.target as HTMLElement;
  
        /**
         * this slug MUST be tab supported
         */
        const slug = sec.dataset.h1id;
  
        if (slug) {
          const tocItem = this.keyToCItemMap[slug];
  
          if (tocItem && tocItem !== this.highlighted) {
            this.clearHighlighted();
            tocItem.classList.add("highlighted");
            this.highlighted = tocItem;
            this.highlightedSection = maxRatioEnt.target;
            this.highlifhtedSecHeight = maxHeight;
          }
        }
      }
    }
  
    private clearHighlighted() {
      if (this.highlighted) {
        this.highlighted.classList.remove("highlighted");
        this.highlighted = null;
      }
    }
  }
  