export function AScroll(selector: string, offset: number): void {
  // DOM要素が完全に読み込まれてから処理を実行
  document.addEventListener("DOMContentLoaded", () => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>(selector);

    anchors.forEach(anchor => {
      anchor.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault(); // デフォルトのアンカー動作をキャンセル

        const href = anchor.getAttribute("href");
        if (!href) return;

        const targetElement = document.getElementById(href.slice(1));
        if (!targetElement) return;

        const y = targetElement.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });

        // URLのハッシュを更新
        history.pushState(null, '', href);
      });
    });
  });
}