import { MDXDocEnvManager } from "./MDXDocEnvManager";

class DummyContainer {
  private dummyContainer: HTMLElement;
  private containerName: string;
  private dummyContents: Node[] = [];
  private dummyMDXHeadings: HTMLHeadingElement[] = [];
  private warps: { [warpId: string]: HTMLElement } = {};

  /**
   * only preparing (change nothing)
   */
  constructor(htmlElm: HTMLElement) {
    this.dummyContainer = htmlElm;
    this.containerName = this.dummyContainer.dataset["dummyName"] || "";
  }

  /**
   *
   * set data-dummy attr for all HTMLElement in DummyContent component
   *
   * this method **SHOULD** be executed early.
   */
  public analyseContent(): void {
    this.dummyContainer.childNodes.forEach((node) => {
      this.recursiveDummyAnalyze(node);

      this.dummyContents.push(node);
    });
  }

  private recursiveDummyAnalyze(node: Node): void {
    if (node instanceof HTMLElement) {
      this.setDummyNameAttr(node);

      /**
       * `Warp` component
       */
      if (node.classList.contains(DummyContainerManager.WARP_CLASS)) {
        const warpId = node.dataset.warpId!;
        this.warps[warpId] = node;
      }

      if (
        node instanceof HTMLHeadingElement &&
        node.classList.contains(MDXDocEnvManager.CLASSES.headings)
      ) {
        this.dummyMDXHeadings.push(node);
      }
    }

    node.childNodes.forEach((n) => {
      this.recursiveDummyAnalyze(n);
    });
  }

  private setDummyNameAttr(htmlElm: HTMLElement): void {
    htmlElm.dataset["dummy"] = this.containerName;
  }

  public removeHeadingFromToC(tocItems: HTMLLIElement[]): void {
    for (const heading of this.dummyMDXHeadings) {
      for (const tocLi of tocItems) {
        if (tocLi.dataset.slug === heading.id) {
          tocLi.parentElement?.removeChild(tocLi);
        }
      }
    }
  }

  public select(cnd: (elm: HTMLElement) => boolean): HTMLElement[] {
    const res: HTMLElement[] = [];

    this.dummyContents.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (cnd(node)) {
          res.push(node);
        }
      }
    });

    return res;
  }

  getWarpByWarpId(warpId: string): HTMLElement | null {
    if (warpId in this.warps) {
      return this.warps[warpId];
    } else {
      return null;
    }
  }

  /**
   * expected to be executed **JUST** before DOMContentLoaded
   *
   * we **SHOULD** be able to get access of dummy contents before DOMContentLoaded
   */
  public removeContents(): void {
    this.dummyContents.forEach((cnt) => {
      this.dummyContainer.removeChild(cnt);
    });
  }

  /**
   * executed after DOMContentLoaded
   */
  public removeContainer(): void {
    this.dummyContainer.parentElement?.removeChild(this.dummyContainer);
  }

  public getContainerName(): string {
    return this.containerName;
  }
}

export class DummyContainerManager {
  private dem: MDXDocEnvManager;
  private containers: DummyContainer[] = [];
  static readonly CLASS = "__dummy-content";
  static readonly SELECTOR = ".__dummy-content";
  static readonly WARP_CLASS = "__warp";

  constructor(dem: MDXDocEnvManager) {
    this.dem = dem;
    this.containers = dem
      .getDummyContainers()
      .map((container) => new DummyContainer(container));
  }

 

  getWarpByWarpId(warpId: string): HTMLElement | null {
    let warp: HTMLElement | null = null;

    for (const container of this.containers) {
      const res = container.getWarpByWarpId(warpId);
      if (res !== null) {
        if (warp !== null) {
          console.error("warpId: ", warpId, " is not unique");
        }

        warp = res;
      }
    }

    return warp;
  }

  public removeDummyHeadingFromToC(tocItems: HTMLLIElement[]): void {
    this.containers.forEach((container) => {
      container.removeHeadingFromToC(tocItems);
    });
  }

  /**
   * set `data-dummy` attr for all `HTMLElement` in `DummyContent` component
   *
   * this method **SHOULD** be executed early.
   */
  public analyzeDummyContainers(): void {
    this.containers.forEach((container) => {
      container.analyseContent();
    });
  }

  getContainerByName(name: string): DummyContainer[] {
    const res: DummyContainer[] = [];

    this.containers.forEach((container) => {
      if (container.getContainerName() === name) {
        res.push(container);
      }
    });

    return res;
  }

  /**
   * expected to be executed **JUST** before DOMContentLoaded
   *
   * we **SHOULD** be able to get access of dummy contents before DOMContentLoaded
   */
  public removeContents(): void {
    this.containers.forEach((container) => {
      container.removeContents();
    });
  }

  /**
   * executed after DOMContentLoaded
   */
  public removeContainers(): void {
    this.containers.forEach((container) => {
      container.removeContainer();
    });
  }

  public static isDummyContent(htmlElm: HTMLElement): boolean {
    return htmlElm.dataset.dummy !== undefined;
  }
}
