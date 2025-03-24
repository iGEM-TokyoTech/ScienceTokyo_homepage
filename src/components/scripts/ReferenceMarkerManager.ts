import { MDXDocEnvManager } from "./MDXDocEnvManager";

export class ReferenceMarkerManager {
  marker: HTMLElement;
  next: HTMLHeadingElement;
  static readonly CLASS = "__reference-marker";
  static readonly SELECTOR = ".__reference-marker";

  /**
   * **SHOULD** be constructed before sectionizer
   */
  constructor(marker: HTMLElement) {
    this.marker = marker;
    this.next = this.marker.parentElement as HTMLHeadingElement;
  }

  /**
   * **SHOULD** be executed before sectionizer
   */
  markHeading(): void {
    this.next.dataset.reference = "true";
    this.deleteSelf();
  }

  deleteSelf(): void {
    this.marker.parentNode?.removeChild(this.marker);
  }

  private recursiveSibling(elm: Element): HTMLHeadingElement | null {
    if (
      elm instanceof HTMLHeadingElement &&
      elm.classList.contains(MDXDocEnvManager.CLASSES.headings)
    ) {
      return elm;
    } else {
      if (elm.nextElementSibling) {
        return this.recursiveSibling(elm.nextElementSibling);
      } else {
        console.error("cannot find Heading Element");
        return null;
      }
    }
  }
}
