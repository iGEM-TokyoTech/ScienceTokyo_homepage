export class FlipCard {
    private elm: HTMLElement;
    static readonly CLASS = "__flip-card";
    static readonly FLIP_CLASS = "flipped";
  
    private flipped: boolean = false;
  
    constructor(elm: HTMLElement) {
      this.elm = elm;
    }
  
    private flip(): void {
      if (this.flipped) {
        this.elm.classList.remove(FlipCard.FLIP_CLASS);
      } else {
        this.elm.classList.add(FlipCard.FLIP_CLASS);
      }
  
      this.flipped = !this.flipped;
    }
  
    start(): void {
      this.elm.addEventListener("click", () => {
        this.flip();
      });
    }
  }
  