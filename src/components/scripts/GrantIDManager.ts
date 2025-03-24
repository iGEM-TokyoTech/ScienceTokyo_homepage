export class GrantIdManager {
    grant: HTMLSpanElement;
    next: Element;
    static readonly CLASS = "__grant-id";
    static readonly SELECTOR = ".__grant-id";
  
    constructor(htmlElm: HTMLSpanElement) {
      this.grant = htmlElm;
      console.log(this.grant);
      this.next = htmlElm.nextElementSibling!;
      console.log(this.next);
  
      if (this.next.id === "") {
        this.next.id = this.grant.dataset.dummyId!;
      }
  
      this.grant.remove();
    }
  }