import { DummyContainerManager } from "./DummyContainer";
import { DummyFigCaption } from "./DummyFigCaption";
import { GrantIdManager } from "./GrantIDManager";
import { MDXDocEnvSectionizer } from "./MDXDocEnvSectionizer";
import { PopUpManager } from "./PopUp";
import { RefAnchorManager } from "./RefAnchor";
import { ReferenceMarkerManager } from "./ReferenceMarkerManager";
import { TableCaptionManager } from "./TableCaptionManager";

export class HeadingTreeNode {
  data: HTMLHeadingElement | "root";
  headingType: number;
  children: HeadingTreeNode[];
  parent: HeadingTreeNode | null;

  rootNode: HeadingTreeNode;

  constructor(data: HTMLHeadingElement, root: HeadingTreeNode);
  constructor(data: "root");
  constructor(data: HTMLHeadingElement | "root", root?: HeadingTreeNode) {
    this.data = data;

    if (data === "root") {
      this.headingType = 0;
    } else {
      this.headingType = parseInt(data.tagName[1]);
    }

    this.children = new Array();
    this.parent = null;

    if (root) {
      this.rootNode = root;
    } else {
      this.rootNode = this;
    }
  }

  setParent(parent: HeadingTreeNode): void {
    if (this.parent !== null) {
      console.warn("parent " + this.parent + " is already set");
    }

    this.parent = parent;
  }

  addChild(child: HeadingTreeNode): boolean {
    if (this.headingType !== child.getHeadingType() - 1) {
      console.error(
        "parent's heading type is " +
          this.headingType +
          " but child heading type is " +
          child.getHeadingType(),

        this,
        child,
      );

      this.children.push(child);
      child.setParent(this);

      return false;
    } else {
      this.children.push(child);
      child.setParent(this);

      return true;
    }
  }

  getHeadingType(): number {
    return this.headingType;
  }

  getLatestChild(): HeadingTreeNode | null {
    if (this.children.length > 0) {
      return this.children[this.children.length - 1];
    } else {
      return null;
    }
  }

  getNthLatestChild(nth: number): HeadingTreeNode {
    let ret: HeadingTreeNode = this;

    for (let i = 0; i < nth; i++) {
      const tmp = ret.getLatestChild();
      if (tmp === null) {
        console.error("no latest " + nth + "th child of " + this);
        break;
      } else {
        ret = tmp;
      }
    }

    return ret;
  }
}

/**
 * this class can give you abstract structure of MDXDocEnv content
 */
export class MDXDocEnvManager {
  static readonly CLASSES = {
    docenv: "mdx-docenv",
    headings: "mdx-heading",
  };

  static readonly SELECTORS = {
    docenv: ".mdx-docenv",
    headings: ".mdx-heading",
  };
  private docenv: HTMLElement;
  private dummyContainers: HTMLElement[];
  private dcm: DummyContainerManager;
  private popUpManager: PopUpManager;
  private marker: ReferenceMarkerManager | null = null;
  private referenceSection: HTMLElement | null = null;
  private headings: HTMLHeadingElement[];
  private headingTree = new HeadingTreeNode("root");
  private sections: HTMLElement[] | null = null;
  private ram: RefAnchorManager;

  constructor(docenv: HTMLElement) {
    this.docenv = docenv;
    this.dummyContainers = Array.from(
      docenv.querySelectorAll<HTMLElement>(DummyContainerManager.SELECTOR),
    );

    this.dcm = new DummyContainerManager(this);

    this.popUpManager = new PopUpManager(this);

    this.headings = Array.from(
      docenv.querySelectorAll<HTMLHeadingElement>(
        MDXDocEnvManager.SELECTORS.headings,
      ),
    );

    const marker = docenv.querySelector<HTMLElement>(
      ReferenceMarkerManager.SELECTOR,
    );

    if (marker) {
      this.marker = new ReferenceMarkerManager(marker);
    }

    this.ram = new RefAnchorManager(this);
  }

  /**
   * **SHOULD** be executed before sectionizer
   */
  public markReferenceHeading(): void {
    console.log(this.marker);
    this.marker?.markHeading();
  }

  setReferenceSection(refSec: HTMLElement): void {
    if (!this.referenceSection) {
      this.referenceSection = refSec;
    } else {
      console.error("refSec is already set");
    }
  }

  /**
   * this method **SHOULD** be executed after `this.analyzeDummyContainers()`
   */
  public makeHeadingTree(): void {
    this.headings.forEach((heading) => {
      if (DummyContainerManager.isDummyContent(heading)) {
        const node = new HeadingTreeNode(heading, this.headingTree);

        const nodeType = node.getHeadingType();

        const desirableParent = this.headingTree.getNthLatestChild(
          nodeType - 1,
        );

        desirableParent.addChild(node);
      }
    });
  }

  public getDocEnv(): HTMLElement {
    return this.docenv;
  }

  public getHeadings(): HTMLHeadingElement[] {
    return this.headings;
  }

  public getHeadingTree(): HeadingTreeNode {
    return this.headingTree;
  }

  public setDocEnvSections(sections: HTMLElement[]): void {
    if (!this.sections) {
      this.sections = sections;
    } else {
      throw new Error("MDXDocEnvManager.sections has already been set.");
    }
  }

  public getDummyContainers(): HTMLElement[] {
    return this.dummyContainers;
  }

  public getWarpByWarpId(warpId: string): HTMLElement | null {
    return this.dcm.getWarpByWarpId(warpId);
  }
  /**
   * set data-dummy attr for all HTMLElement in DummyContent component
   *
   * this method **SHOULD** be executed early.
   */
  analyzeDummyContainers(): void {
    this.dcm.analyzeDummyContainers();
  }

  /**
   * this method **SHOULD** be executed before TabID management because
   * auto sections **SHOULD** hava tab info like other tab supported elements.
   */
  sectionize(): void {
    const sectionizer = new MDXDocEnvSectionizer(this);
    sectionizer.sectionize();
  }

  /**
   * - `mdx-table`
   */
  independentMDXComponentManagement(): void {
    // 全ての <table> に 'mdx-table' クラスが付いているものを取得
    const tables =
      this.docenv.querySelectorAll<HTMLTableElement>("table.mdx-table");

    tables.forEach((table) => {
      // thead 内の最初の tr を取得して 'first' クラスを追加
      const theadFirstTr = table.querySelector("thead > tr");
      if (theadFirstTr) {
        theadFirstTr.classList.add("first");
      } else {
        const tbodyFirstTr = table.querySelector("tbody > tr");
        if (tbodyFirstTr) {
          tbodyFirstTr.classList.add("first");
        }
      }
      // tbody 内の最初の tr を取得して 'first' クラスを追加
    });

    const tableCaptionContainers = this.docenv.querySelectorAll<HTMLElement>(
      TableCaptionManager.SELECTOR.container,
    );

    tableCaptionContainers.forEach((container) => {
      const manager = new TableCaptionManager(container);
      manager.warpCaption();
    });

    this.popUpManager.popupGetWarpRef();
    // this.popUpManager.popupWarp();

    const dummyFigCaptions = this.docenv.querySelectorAll<HTMLElement>(
      "." + DummyFigCaption.CLASS,
    );
    dummyFigCaptions.forEach((dfigc) => {
      new DummyFigCaption(dfigc);
    });
  }

  /**
   * expected to be executed **JUST** before DOMContentLoaded
   *
   * we **SHOULD** be able to get access of dummy contents before DOMContentLoaded
   */
  removeDummyContents(): void {
    this.popUpManager.popupWarp();
    this.dcm.removeContents();
  }

  /**
   * expected to be  executed after DOMContentLoaded
   */
  removeContainers(): void {
    this.dcm.removeContainers();
  }

  public removeDummyHeadingFromToC(tocItems: HTMLLIElement[]): void {
    this.dcm.removeDummyHeadingFromToC(tocItems);
  }

  /**
   * **SHOULD** be called after sectionize
   * @returns
   */
  getRefrenceSection(): HTMLElement | null {
    return this.referenceSection;
  }

  /**
   * **SHOULD** be called after tabId
   */
  refAnchorSetReferenceHref(): void {
    this.ram.setReferenceHref();
  }

  /**
   * **SHOULD** be very early time
   */
  grantId(): void {
    const granters = this.docenv.querySelectorAll<HTMLSpanElement>(
      GrantIdManager.SELECTOR,
    );

    granters.forEach((granter) => {
      new GrantIdManager(granter);
    });
  }
}

export class MDXDocEnvCollection {
  docenvs: HTMLElement[];
  managers: MDXDocEnvManager[];
  constructor() {
    this.docenvs = Array.from(
      document.querySelectorAll<HTMLElement>(MDXDocEnvManager.SELECTORS.docenv),
    );

    this.managers = this.docenvs.map((docenv) => new MDXDocEnvManager(docenv));
  }

  /**
   * **SHOULD** be executed before sectionizer
   */
  markReferenceHeading(): void {
    this.managers.forEach((manager) => manager.markReferenceHeading());
  }

  /**
   * set data-dummy attr for all HTMLElement in DummyContent component
   *
   * this method **SHOULD** be executed early.
   */
  analyzeDummyContainers(): void {
    this.managers.forEach((manager) => manager.analyzeDummyContainers());
  }

  /**
   * this method **SHOULD** be executed before TabID management because
   * auto sections **SHOULD** hava tab info like other tab supported elements.
   */
  sectionize(): void {
    this.managers.forEach((manager) => manager.sectionize());
  }

  /**
   * expected to be executed **JUST** before DOMContentLoaded
   *
   * we **SHOULD** be able to get access of dummy contents before DOMContentLoaded
   */
  removeDummyContents(): void {
    this.managers.forEach((manager) => manager.removeDummyContents());
  }

  /**
   * expected to be  executed after DOMContentLoaded
   */
  removeContainers(): void {
    this.managers.forEach((manager) => manager.removeContainers());
  }

  removeDummyHeadingFromToC(tocs: HTMLUListElement[]): void {
    let tocItems: HTMLLIElement[] = [];
    tocs.forEach((toc) => {
      tocItems = tocItems.concat(
        Array.from(toc.querySelectorAll<HTMLLIElement>(":scope > li")),
      );
    });
    this.managers.forEach((manager) => {
      manager.removeDummyHeadingFromToC(tocItems);
    });
  }

  /**
   * - `mdx-table`
   */
  independentMDXComponentManagement(): void {
    this.managers.forEach((manager) =>
      manager.independentMDXComponentManagement(),
    );
  }

  /**
   * **SHOULD** be called after tabId
   */
  refAnchorSetReferenceHref(): void {
    this.managers.forEach((manager) => manager.refAnchorSetReferenceHref());
  }

  /**
   * **SHOULD** be very early time
   */
  grantId(): void {
    this.managers.forEach((manager) => manager.grantId());
  }
}
