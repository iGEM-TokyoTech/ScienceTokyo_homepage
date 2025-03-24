export class TableCaptionManager {
    container: HTMLElement;
    caption: HTMLElement;
    table: HTMLTableElement;
  
    static readonly CLASSES = {
      container: "__mdx-caption-container",
      caption: "__table-caption",
    };
  
    static readonly SELECTOR = {
      container: ".__mdx-caption-container",
      caption: ".__table-caption",
    };
  
    constructor(htmlElm: HTMLElement) {
      this.container = htmlElm;
      this.table = htmlElm.querySelector<HTMLTableElement>("table.mdx-table")!;
      const spanCap = htmlElm.querySelector<HTMLSpanElement>(
        TableCaptionManager.SELECTOR.caption,
      )!;
  
      this.caption = document.createElement("caption");
      console.log();
  
      // this.caption.innerHTML = spanCap.innerHTML;
      // spanCap.innerHTML = "";
  
      // while (spanCap.firstChild) {
      //   this.caption.appendChild(spanCap.firstChild);
      // }
  
      this.caption.replaceChildren(...spanCap.childNodes);
  
      spanCap.remove();
    }
  
    warpCaption(): void {
      console.log(this.table);
      this.table.prepend(this.caption);
  
      while (this.container.firstChild) {
        this.container.parentNode?.insertBefore(
          this.container.firstChild,
          this.container,
        );
      }
      this.container.remove();
    }
  }
  