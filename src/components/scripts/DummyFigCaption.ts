export class DummyFigCaption {
    static readonly CLASS = "__dummy-figcaption";
    dummy: HTMLElement;
    next: HTMLElement;
    nextFigCap: HTMLElement;
  
    constructor(dummy: HTMLElement) {
      if (dummy.tagName !== "FIGCAPTION") {
        throw new Error("Next sibling is not a FIGCAPTION element.");
      }
      this.dummy = dummy;
  
      const nextElm = dummy.nextElementSibling;
      if (!(nextElm instanceof HTMLElement && nextElm.tagName === "FIGURE")) {
        throw new Error("Next sibling is not a FIGURE element.");
      }
      this.next = nextElm;
      this.nextFigCap = nextElm.querySelector("figcaption")!;
  
      this.nextFigCap.replaceChildren(...this.dummy.childNodes);
  
      this.dummy.remove();
    }
  }
  