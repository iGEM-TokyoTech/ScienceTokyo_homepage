import { AstroAnchor } from "./AstroAnchor";
import { NavigationManager } from "./NavigationManager";
import { ToCHighlighter } from "./ToCHighlighter";
import { ToggleManager } from "./ToggleManager";
import { FlipCard } from "./FlipCard";
import { MDXDocEnvCollection } from "./MDXDocEnvManager";
import { TabCollection } from "./TabCollection";

export class Scripts {
  dec: MDXDocEnvCollection | null = null;

  tocs: HTMLUListElement[] | null = null;

  tabCollection: TabCollection | null = null;

  nm: NavigationManager | null = null;

  flipCard: boolean = false;
  tab: boolean = false;
  mdx: boolean = false;
  homeNav: boolean = false;
  toc: boolean = false;
  toggle: boolean = false;

  constructor() {}

  public setFlipCard(): Scripts {
    this.flipCard = true;
    return this;
  }

  public setMDX(): Scripts {
    this.mdx = true;
    if (this.dec === null) {
      this.dec = new MDXDocEnvCollection();
    }
    return this;
  }

  public setTab(): Scripts {
    this.tab = true;
    if (this.tabCollection === null) {
      if (this.tocs === null) {
        this.tocs = Array.from(
          document.querySelectorAll<HTMLUListElement>("ul.toc"),
        );
      }

      this.tabCollection = new TabCollection(this.tocs);
    }
    return this;
  }

  public setToC(): Scripts {
    this.toc = true;
    if (this.tocs === null) {
      this.tocs = Array.from(
        document.querySelectorAll<HTMLUListElement>("ul.toc"),
      );
    }

    return this;
  }

  public setHomeNav(): Scripts {
    this.homeNav = true;
    return this;
  }

  public setToggle(): Scripts {
    this.toggle = true;
    return this;
  }

  /**
   * `AstroAnchor`
   *
   * `FlipCard`
   *
   * `Toggle`
   */
  private independentGlobalManagement(): void {
    document
      .querySelectorAll<HTMLAnchorElement>(".astro-anchor")
      .forEach((anchor) => {
        AstroAnchor.setBasePathHref(anchor);
      });

    if (this.flipCard) {
      const cards = document.querySelectorAll<HTMLElement>(
        "." + FlipCard.CLASS,
      );
      cards.forEach((card) => {
        const flip = new FlipCard(card);
        flip.start();
      });
    }

    if (this.toggle) {
      const managers = new ToggleManager(
        Array.from(
          document.querySelectorAll<HTMLElement>(
            ToggleManager.SELECTORS.toggle,
          ),
        ),
      );

      managers.init();
    }

    if (this.mdx) {
      this.dec?.independentMDXComponentManagement();
    }

    if (this.tab) {
      this.tabCollection?.initTabSelector();
    }

    if (this.homeNav) {
      class HomeNavigationManager extends NavigationManager {
        constructor() {
          super();
          this.state = "invisible";
        }
        mqlSetUp(): void {}
      }

      this.nm = new HomeNavigationManager();
    } else {
      this.nm = new NavigationManager();
    }

    this.nm.init();
  }

  private beforeDOMContentLoaded(): void {
    if (this.mdx) {
      this.dec?.analyzeDummyContainers();
      this.dec?.grantId();
      this.dec?.markReferenceHeading();
      this.dec?.sectionize();
    }

    if (this.tab) {
      this.tabCollection?.manageID();
    }

    this.independentGlobalManagement();

    if (this.mdx) {
      this.dec?.refAnchorSetReferenceHref();
      this.dec?.removeDummyHeadingFromToC(this.tocs!);
      this.dec?.removeDummyContents();
    }
  }

  /**
   * dummy container removal
   *
   * toc highlighter
   */
  private afterDOMContentLoaded(): void {
    if (this.mdx || this.toc) {
      document.addEventListener("DOMContentLoaded", () => {
        if (this.mdx) {
          this.dec!.removeContainers();
        }

        if (this.toc) {
          const highlighter = new ToCHighlighter(this.tocs!);
          highlighter.init();
        }
      });
    }
  }

  public exec(): void {
    this.beforeDOMContentLoaded();
    this.afterDOMContentLoaded();
  }
}
