import type { MDXDocEnvManager } from "./MDXDocEnvManager";

class PopUp {
  dem: MDXDocEnvManager;
  popup: HTMLSpanElement;
  content: HTMLSpanElement;
  warpRef: HTMLElement | null = null;

  warpId: string;
  constructor(dem: MDXDocEnvManager, popup: HTMLSpanElement) {
    this.dem = dem;
    this.popup = popup;
    this.content = this.popup.querySelector<HTMLSpanElement>(
      PopUpManager.SELETOR.content,
    )!;
    this.warpId = popup.dataset.warpId!;
  }

  /**
   * **SHOULD** be done before
   */
  getWarpRef(): void {
    this.warpRef = this.dem.getWarpByWarpId(this.warpId);
  }

  /**
   * **SHOULD** be done just before del dummy content
   */
  warp(): void {
    if (this.warpRef !== null) {
      // warp の子要素をすべて取得
      const children = Array.from(this.warpRef.childNodes);

      // 子要素をコピーして移動する
      children.forEach((child) => {
        this.content.appendChild(child.cloneNode(true));
      });
    }
  }
}

export class PopUpManager {
  dem: MDXDocEnvManager;
  popups: PopUp[];
  static readonly CLASSES = {
    popup: "__popup",
    content: "__popup-content",
  };

  static readonly SELETOR = {
    popup: `.${PopUpManager.CLASSES.popup}`,
    content: `.${PopUpManager.CLASSES.content}`,
  };

  constructor(dem: MDXDocEnvManager) {
    this.dem = dem;
    this.popups = Array.from(
      dem
        .getDocEnv()
        .querySelectorAll<HTMLSpanElement>(PopUpManager.SELETOR.popup),
    ).map((popup) => new PopUp(this.dem, popup));
  }

  popupGetWarpRef(): void {
    this.popups.forEach((popup) => {
      popup.getWarpRef();
    });
  }

  popupWarp(): void {
    this.popups.forEach((popup) => {
      popup.warp();
    });
  }
}
