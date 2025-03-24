import { Dropdown } from "./Dropdown";

/**
 * manage all DropDown
 *
 */
export class DropdownManager {
  private dropdowns: Dropdown[] = [];
  private defaultDropDown: Dropdown | null = null;

  addDropdown(container: HTMLElement): void {
    const newDropdown = new Dropdown(container);
    this.dropdowns.forEach((dropdown) =>
      dropdown.addLinkedDropdowns(newDropdown),
    );
    newDropdown.addLinkedDropdowns(this.dropdowns);
    this.dropdowns.push(newDropdown);

    if (newDropdown.isDefaultPageToggle()) {
      this.defaultDropDown = newDropdown;
    }
  }

  listenToAllDropdowns(): void {
    this.dropdowns.forEach((dropdown) => {
      dropdown.listenToggleClick();
      dropdown.listenItemClicks();
    });
  }

  // listenToDocument(): void {
  //   document.addEventListener("click", (event) => {
  //     this.dropdowns.forEach((dropdown) => dropdown.handleDocumentClick(event));
  //   });
  // }

  hideAll(): void {
    this.dropdowns.forEach((dd) => dd.hide());
  }

  visibleDefaultDropDown(): void {
    this.hideAll();
    this.defaultDropDown?.show();
  }
}
