import { DummyContainerManager } from "./DummyContainer";
import { MDXDocEnvSectionizer } from "./MDXDocEnvSectionizer";


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
  private headings: HTMLHeadingElement[];
  private headingTree = new HeadingTreeNode("root");
  private sections: HTMLElement[] | null = null;

  constructor(docenv: HTMLElement) {
    this.docenv = docenv;

    this.headings = Array.from(
      docenv.querySelectorAll<HTMLHeadingElement>(
        MDXDocEnvManager.SELECTORS.headings,
      ),
    );

  }

  /**
   * **SHOULD** be executed before sectionizer
   */


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

    
  }

  /**
   * expected to be executed **JUST** before DOMContentLoaded
   *
   * we **SHOULD** be able to get access of dummy contents before DOMContentLoaded
   */
  
}

