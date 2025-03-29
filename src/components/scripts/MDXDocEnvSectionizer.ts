import { ToCHighlighter } from "./ToCHighlighter";
import { HeadingTreeNode, MDXDocEnvManager } from "./MDXDocEnvManager";

/**
 * MDXDocEnvSectionizer
 *
 */
export class MDXDocEnvSectionizer {
  static readonly CLASSES = {
    autoSection: "mdx-auto-section",
  };

  static readonly DATA_ATTRS = {
    referenceDataAttr: "reference",
  };

  private dem: MDXDocEnvManager;
  private docenv: HTMLElement;
  private headings: HTMLHeadingElement[];
  private headingTree: HeadingTreeNode;

  constructor(dem: MDXDocEnvManager) {
    this.dem = dem;
    this.docenv = dem.getDocEnv();
    this.headings = Array.from(
      this.docenv.querySelectorAll<HTMLHeadingElement>(
        ":scope > ." + MDXDocEnvManager.CLASSES.headings,
      ),
    );
    this.headingTree = dem.getHeadingTree();
  }

  static genSecIdFromH1Id(h1Id: string): string {
    return "sec-" + h1Id;
  }

  /**
   * this method **SHOULD** be executed before TabID management because
   * auto sections **SHOULD** hava tab info like other tab supported elements.
   */
  sectionize(): void {
    const sections: HTMLElement[] = [];
    let currentSection: HTMLElement | null = null;

    // Get all child nodes of mdx-docenv
    let children = Array.from(this.docenv.childNodes);

    let isRefSec = false;

    children.forEach((child) => {
      // If the child is an H1 element, start a new section
      if (
        child instanceof HTMLElement &&
        child.tagName === "H1" &&
        child.classList.contains(MDXDocEnvManager.CLASSES.headings)
      ) {
        // Close the previous section if it exists
        if (currentSection) {
          this.docenv.insertBefore(currentSection, child);
          sections.push(currentSection);
        }

        if (child.dataset.reference === "true") {
          isRefSec = true;
        }

        // Create a new section for the next block
        currentSection = document.createElement("section");
        currentSection.classList.add(MDXDocEnvSectionizer.CLASSES.autoSection);
        currentSection.classList.add(ToCHighlighter.OBSERVED_CLASS);
        currentSection.dataset.h1id = child.id;
        currentSection.id = MDXDocEnvSectionizer.genSecIdFromH1Id(child.id);

        if (isRefSec) {
          currentSection.dataset.reference = "true";
        }
      }

      // Add the current element to the current section
      if (currentSection) {
        currentSection.appendChild(child);
      }
    });

    // Append the final section
    if (currentSection) {
      this.docenv.appendChild(currentSection);
      sections.push(currentSection);
    }

    this.dem.setDocEnvSections(sections);
  }

  init(): void {
    this.sectionize();
  }
}
