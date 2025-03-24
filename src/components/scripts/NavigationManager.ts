import { Dropdown } from "./Dropdown";
import { DropdownManager } from "./DropdownManager";

/**
 * レスポンシブ対応
 */
export class NavigationManager {
  /// "default" なら PC画面 (幅が 768px 以上)
  state: "default" | "visible" | "invisible";
  hamburger: HTMLElement | null;
  siteNav: HTMLElement | null;
  navOut: HTMLElement | null;
  /**
   * 画面幅監視
   */
  mql: MediaQueryList;

  dm: DropdownManager;

  /**
   * if less than or equal to threshold => smartphone
   */
  static readonly threshold: number = 768;

  static readonly IDS = {
    hamburger: "site-nav-hamburger",
    navigation: "headersite-nav",
    /**
     * outside of navigation (only responsive)
     */
    outside: "out-site-nav",
  };

  constructor() {
    if (window.innerWidth <= NavigationManager.threshold) {
      this.state = "invisible";
    } else {
      this.state = "default";
    }

    this.hamburger = document.getElementById(NavigationManager.IDS.hamburger);
    this.siteNav = document.getElementById(NavigationManager.IDS.navigation);
    this.navOut = document.getElementById(NavigationManager.IDS.outside);
    this.mql = window.matchMedia(
      `(max-width: ${NavigationManager.threshold}px)`,
    );

    this.dm = new DropdownManager();
    const dropdownContainers = document.querySelectorAll<HTMLElement>(
      Dropdown.SELECTORS.container,
    );

    dropdownContainers.forEach((container) => this.dm.addDropdown(container));

    this.mqlSetUp();
    this.hamburgerSetUp();
  }

  hamburgerSetUp(): void {
    this.hamburger?.addEventListener("click", (ev) => {
      /// ハンバーガーボタン が押されたときの処理
      if (this.state === "visible") {
        this.invisible();
      } else if (this.state === "invisible") {
        this.visible();
      }

      ev.stopPropagation();
    });
  }

  mqlSetUp(): void {
    this.mql.addEventListener("change", (ev) => {
      if (ev.matches) {
        if (this.state === "default") {
          this.invisible();
        }
      } else {
        this.default();
      }
    });
  }

  visible(): void {
    this.state = "visible";
    document.body.style.overflowY = "hidden";
    this.siteNav?.classList.add("visible");
    this.navOut?.classList.add("visible");
    this.hamburger?.classList.add("visible");
    this.dm.visibleDefaultDropDown();
  }

  invisible(): void {
    this.state = "invisible";
    document.body.style.overflowY = "auto";
    this.siteNav?.classList.remove("visible");
    this.navOut?.classList.remove("visible");
    this.hamburger?.classList.remove("visible");
  }

  default(): void {
    this.state = "default";
    document.body.style.overflowY = "auto";
    this.siteNav?.classList.remove("visible");
    this.navOut?.classList.remove("visible");
    this.hamburger?.classList.remove("visible");
  }

  init(): void {
    this.dm.visibleDefaultDropDown();
    this.dm.listenToAllDropdowns();
    // this.dm.listenToDocument();
  }
}

