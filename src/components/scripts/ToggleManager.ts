/**
 * logic for Toggle Component
 */
class ToggleManagerInner {
    private toggle: HTMLElement;
    private heading: HTMLElement;
    private content: HTMLElement;
    private visiblity: boolean = false;
  
    constructor(toggle: HTMLElement) {
      this.toggle = toggle;
      this.heading = toggle.querySelector<HTMLElement>(
        ToggleManager.SELECTORS.heading,
      )!;
      this.content = toggle.querySelector<HTMLElement>(
        ToggleManager.SELECTORS.content,
      )!;
    }
  
    init(): void {
      this.invisible();
      this.heading.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.toggleVisiblity();
      });
    }
  
    visible(): void {
      this.visiblity = true;
      this.content.classList.add("visible");
      this.heading.classList.add("visible");
      this.content.classList.remove("invisible");
      this.heading.classList.remove("invisible");
    }
  
    invisible(): void {
      this.visiblity = false;
      this.content.classList.add("invisible");
      this.heading.classList.add("invisible");
      this.content.classList.remove("visible");
      this.heading.classList.remove("visible");
    }
  
    toggleVisiblity(): void {
      this.visiblity ? this.invisible() : this.visible();
    }
  }
  
  /**
   * manage all Toggle components logic
   */
  export class ToggleManager {
    private toggles: HTMLElement[];
    private tmis: ToggleManagerInner[] = [];
  
    static CLASSES = {
      toggle: "__doc-toggle",
      heading: "__doc-toggle-heading",
      content: "__doc-toggle-content",
    };
  
    static SELECTORS = {
      toggle: ".__doc-toggle",
      heading: ".__doc-toggle-heading",
      content: ".__doc-toggle-content",
    };
  
    /**
     * usage
     * ```typescript
     * const toggleNodeList = document.querySelectorAll<HTMLElement>(
     *  ToggleManager.SELECTORS.toggle
     * );
     *
     * const toggles: HTMLElement[] = [];
     * toggleNodeList.forEach((toggle) => {toggles.push(toggle)});
     * ```
     * @param toggles all toggle components
     */
    constructor(toggles: HTMLElement[]) {
      this.toggles = toggles;
  
      toggles.forEach((toggle) => {
        this.tmis.push(new ToggleManagerInner(toggle));
      });
    }
  
    public init(): void {
      this.tmis.forEach((tmi) => {
        tmi.init();
      });
    }
  }
  