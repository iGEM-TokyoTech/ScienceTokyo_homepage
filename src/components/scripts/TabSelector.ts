export class TabSelector {
    tabSelectors: HTMLButtonElement[];
    tabs: HTMLElement[];
    tocs: HTMLUListElement[] = [];
    visibleTabId: string | null = null;
    tabMap: {
      [key: string]: {
        selectButton: HTMLButtonElement;
        tab: HTMLElement;
        toc: HTMLUListElement;
      };
    } = {};
  
    static readonly CLASSES = {
      selectButton: "__tab-select-button",
      toc: "__tab-toc",
    };
  
    static readonly SELECTORS = {
      selectButton: `.${TabSelector.CLASSES.selectButton}`,
      toc: `.${TabSelector.CLASSES.toc}`,
    };
  
    constructor(tabs: HTMLElement[], tocs: HTMLUListElement[]) {
      this.tabs = tabs;
  
      this.tabSelectors = Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          TabSelector.SELECTORS.selectButton,
        ),
      );
  
      this.tocs = tocs;
  
      this.createTabMap();
    }
  
    private createTabMap(): void {
      this.tabSelectors.forEach((tabSelector) => {
        if (tabSelector.dataset.tabId === undefined) {
          throw new Error("data-tab-id is not set");
        }
        const tabId = tabSelector.dataset.tabId;
  
        // Find the tab and toc with matching data-tab-id
        const tab = Array.from(this.tabs).find(
          (t) => (t.dataset.tabId || null) === tabId,
        );
        const toc = Array.from(this.tocs).find(
          (t) => (t.dataset.tabId || null) === tabId,
        );
  
        // Ensure tabId is valid and there's corresponding elements
        if (tab && toc) {
          this.tabMap[tabId] = {
            selectButton: tabSelector,
            tab: tab,
            toc: toc,
          };
        } else {
          console.error("tab: " + tab, " toc: " + toc, " is invalid");
        }
      });
    }
  
    /**
     * set click event listener to button
     */
    initTabSelector(): void {
      const keys: string[] = Object.keys(this.tabMap);
      for (let key of keys) {
        this.invisible(key);
      }
      this.visible(keys[0]);
      for (let [key, val] of Object.entries(this.tabMap)) {
        val.selectButton.addEventListener("click", (ev) => {
          this.visible(key);
          ev.stopPropagation();
        });
      }
    }
  
    /**
     * make key tab invisible if key tab is visible or do nothing
     * @param key
     */
    invisible(key: string | null): void {
      if (key !== null) {
        if (this.visibleTabId === key) {
          const val = this.tabMap[key];
          val.selectButton.classList.remove("visible");
          val.tab.classList.remove("visible");
          val.toc.classList.remove("visible");
  
          this.visibleTabId = null;
        }
      }
    }
  
    /**
     * make visible tab invisible if visible tab is not key or do nothing
     * @param key
     */
    visible(key: string): void {
      // this.invisible(this.visibleTabId);
      // if (this.visibleTabId !== key) {
      if (key && this.visibleTabId !== key) {
        this.invisible(this.visibleTabId);
        const val = this.tabMap[key];
        val.selectButton.classList.add("visible");
        val.tab.classList.add("visible");
        val.toc.classList.add("visible");
  
        this.visibleTabId = key;
      }
    }
  }
  