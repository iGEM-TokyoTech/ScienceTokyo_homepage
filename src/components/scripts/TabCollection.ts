import { TabIdManeger } from "./TabIdManager";
import { TabSelector } from "./TabSelector";

export class TabCollection {
  static readonly CLASS = "__tab";
  static readonly SELECTOR = `.${TabCollection.CLASS}`;
  tabs: HTMLElement[];
  tabSelector: TabSelector;
  tabIdManagers: TabIdManeger[];

  constructor(tocs: HTMLUListElement[]) {
    this.tabs = Array.from(
      document.querySelectorAll<HTMLElement>(TabCollection.SELECTOR),
    );

    this.tabSelector = new TabSelector(this.tabs, tocs);

    this.tabIdManagers = this.tabs.map((tab) => new TabIdManeger(tab));
  }

  /**
   * auto section also **SHOULD** have tabInfo, therefore, this method
   * **SHOULD** be executed **after sectionize**.
   *
   * get all elements in `Tab`, and add prefix to id of element in `Tab`
   *
   * change inner link of `HTMLAnchorElement` to `Tab` supported
   *
   * add tabInfo to all `HTMLElement` in `Tab`
   */
  public manageID(): void {
    this.tabIdManagers.forEach((manager) => {
      manager.manageID();
    });
  }

  /**
   *
   */
  public initTabSelector(): void {
    this.tabSelector.initTabSelector();
  }
}
