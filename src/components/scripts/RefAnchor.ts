import type { MDXDocEnvManager } from "./MDXDocEnvManager";

class RefAnchor {
  refAnchor: HTMLAnchorElement;
  constructor(anchor: HTMLAnchorElement) {
    this.refAnchor = anchor;
  }

  setReferenceHref(refSecId: string): void {
    this.refAnchor.setAttribute("href", "#" + refSecId);
  }
}

export class RefAnchorManager {
  dem: MDXDocEnvManager;
  anchors: RefAnchor[];
  static readonly CLASS = "__ref-anchor";
  static readonly SELECTOR = ".__ref-anchor";

  constructor(dem: MDXDocEnvManager) {
    this.dem = dem;

    this.anchors = Array.from(
      dem
        .getDocEnv()
        .querySelectorAll<HTMLAnchorElement>(RefAnchorManager.SELECTOR),
    ).map((anchor) => new RefAnchor(anchor));
  }

  /**
   * **SHOULD** be called after tabId
   */
  setReferenceHref(): void {
    const refSecId = this.dem.getRefrenceSection()?.id || "";

    this.anchors.forEach((anchor) => anchor.setReferenceHref(refSecId));
  }
}
