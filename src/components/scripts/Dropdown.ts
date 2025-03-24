/**
 * logic for each drop down
 *
 */
export class Dropdown {
    private container: HTMLElement;
    private toggle: HTMLElement | null;
    private menu: HTMLElement | null;
    private items: NodeListOf<HTMLAnchorElement>;
    private isVisible: boolean = false;
    private linkedDropdowns: Dropdown[] = [];
    private readonly isDefaultPage: boolean = false;
  
    static readonly CLASSES = {
      container: "__dropdown",
      toggle: "__dropdown-toggle",
      menu: "__dropdown-menu",
      item: "__dropdown-item",
    };
  
    static readonly SELECTORS = {
      container: "." + this.CLASSES.container,
      toggle: "." + this.CLASSES.toggle,
      menu: "." + this.CLASSES.menu,
      item: `.${this.CLASSES.item} > a`,
    };
  
    constructor(container: HTMLElement) {
      this.container = container;
      this.toggle = container.querySelector<HTMLElement>(
        Dropdown.SELECTORS.toggle,
      );
      this.menu = container.querySelector<HTMLElement>(Dropdown.SELECTORS.menu);
      this.items = container.querySelectorAll<HTMLAnchorElement>(
        Dropdown.SELECTORS.item,
      );
      this.isVisible = this.container?.classList.contains("show") ? true : false;
      this.isDefaultPage = this.container?.dataset["defaultPage"] === "true";
    }
  
    show(): void {
      if (!this.isVisible) {
        this.isVisible = true;
        this.container?.classList.add("show");
      }
    }
  
    hide(): void {
      if (this.isVisible) {
        this.isVisible = false;
        this.container?.classList.remove("show");
      }
    }
  
    toggleVisibility(): void {
      this.isVisible = this.container?.classList.toggle("show") ? true : false;
    }
  
    addLinkedDropdowns(dropdowns: Dropdown | Dropdown[]): void {
      this.linkedDropdowns = this.linkedDropdowns.concat(dropdowns);
    }
  
    hideLinkedDropdowns(): void {
      this.linkedDropdowns.forEach((dropdown) => dropdown.hide());
    }
  
    handleDocumentClick(event: MouseEvent): void {
      // if (!this.menu?.contains(event.target as Node)) {
      //   this.hide();
      // }
    }
  
    listenToggleClick(): void {
      this.toggle?.addEventListener("click", (event) => {
        this.hideLinkedDropdowns();
        this.toggleVisibility();
        event.stopPropagation();
      });
    }
  
    listenItemClicks(): void {
      this.items.forEach((item) => {
        item.addEventListener("click", () => {
          // alert(`Navigating to ${item.href}`);
          this.hide();
        });
      });
    }
  
    isDefaultPageToggle(): boolean {
      return this.isDefaultPage;
    }
  }
  