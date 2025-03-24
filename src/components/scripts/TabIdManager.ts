import { MDXDocEnvSectionizer } from "./MDXDocEnvSectionizer";

/**
 * prevent from duplication of id due to multiple tabs
 */
export class TabIdManeger {
  tab: HTMLElement;
  tabName: string;
  tabId: string;

  /**
   *
   * @param tab `Tab`
   */
  constructor(tab: HTMLElement) {
    this.tab = tab;
    this.tabName = tab.dataset["tabName"]!;
    this.tabId = tab.dataset["tabId"]!;
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
    this.tab.childNodes.forEach((node) => {
      if (node instanceof Element) {
        this.manageIDRecusive(node);
      }
    });
  }

  /**
   * implementation of mangeID()
   */
  private manageIDRecusive(elm: Element): void {
    this.addPrefixToElmID(elm);
    if (elm instanceof HTMLElement) {
      this.setTabInfoToElm(elm);
      if (elm instanceof HTMLAnchorElement) {
        this.addPrefixToAnchorInnerLink(elm);
      } else {
        if (
          elm.tagName === "SECTION" &&
          elm.classList.contains(MDXDocEnvSectionizer.CLASSES.autoSection)
        ) {
          this.addTabInfoToAutoSection(elm);
        }
      }
    }

    elm.childNodes.forEach((node) => {
      if (node instanceof Element) {
        this.manageIDRecusive(node);
      }
    });
  }

  /**
   *
   * @param htmlElm auto section
   */
  private addTabInfoToAutoSection(autoSec: HTMLElement): void {
    autoSec.dataset.h1id = this.tabName + "-" + autoSec.dataset.h1id;
  }

  private addPrefixToElmID(elm: Element): void {
    if (elm.id !== "") {
      elm.id = this.tabName + "-" + elm.id;
    }
  }

  private addPrefixToAnchorInnerLink(anchor: HTMLAnchorElement): void {
    const href = anchor.getAttribute("href") || "";

    if (href.length >= 1 && href[0] === "#") {
      anchor.setAttribute("href", "#" + this.tabName + "-" + href.slice(1));
    }
  }

  private setTabInfoToElm(htmlElm: HTMLElement): void {
    htmlElm.dataset["tabName"] = this.tabName;
    htmlElm.dataset["tabId"] = this.tabId;
  }

  /**
   *
   * @param tabName Name of Tab
   * @returns idname
   */
  static tabNameToIdName(tabName: string): string {
    return tabName
      .toLowerCase() // 小文字に変換
      .trim() // 両端の空白を削除
      .replace(/\s+/g, "-") // スペースをハイフンに変換
      .replace(/[^a-z0-9\-]/g, ""); // 英数字とハイフン以外の文字を削除
  }
}
