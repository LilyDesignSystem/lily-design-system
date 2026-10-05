import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from "@angular/core";

/**
 * FileTree — a hierarchical tree of folders and files with expandable folders
 *
 * Headless Angular component. Root `<ul class="file-tree" role="tree"
 * aria-label>`; the consumer projects `<li role="treeitem" aria-expanded?
 * aria-selected?>` descendants (nested `<ul role="group">` for folders). The
 * root owns the APG tree keyboard over `[role=treeitem]` with ROVING TABINDEX
 * (exactly one item tabindex=0): ArrowDown/Up, ArrowRight (open / first
 * child), ArrowLeft (close / parent), Home/End, `*` (expand siblings),
 * typeahead on the item's own text, Enter/Space (click). Opening and closing
 * toggles `aria-expanded`; consumer CSS hides closed groups. Ships zero CSS.
 *
 * Deviation from the Svelte canonical: no rest-props spread (attributes land
 * on the host element).
 */
@Component({
  selector: "lily-file-tree",
  standalone: true,
  template: `<ul
    #tree
    class="file-tree {{ className() }}"
    role="tree"
    [attr.aria-label]="label()"
    (keydown)="onKeydown($event)"
    (focusin)="onFocusin($event)"
  ><ng-content /></ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTree {
  /** Accessible label, applied to aria-label. */
  readonly label = input.required<string>();
  readonly className = input<string>("");

  private readonly tree = viewChild.required<ElementRef<HTMLElement>>("tree");
  private buffer = "";
  private bufferTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.normalise();
      const observer = new MutationObserver(() => this.normalise());
      observer.observe(this.tree().nativeElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["aria-expanded"],
      });
      destroyRef.onDestroy(() => {
        observer.disconnect();
        clearTimeout(this.bufferTimer);
      });
    });
  }

  private allItems(): HTMLElement[] {
    return Array.from(this.tree().nativeElement.querySelectorAll<HTMLElement>("[role='treeitem']"));
  }

  private parentItem(item: HTMLElement): HTMLElement | null {
    return item.parentElement?.closest<HTMLElement>("[role='treeitem']") ?? null;
  }

  private isVisible(item: HTMLElement): boolean {
    let p = this.parentItem(item);
    while (p) {
      if (p.getAttribute("aria-expanded") === "false") return false;
      p = this.parentItem(p);
    }
    return true;
  }

  private visibleItems(): HTMLElement[] {
    return this.allItems().filter((i) => this.isVisible(i));
  }

  /** The item's own text, excluding any nested group. */
  private ownText(item: HTMLElement): string {
    let text = "";
    item.childNodes.forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).getAttribute("role") === "group") return;
      text += n.textContent ?? "";
    });
    return text.trim().toLowerCase();
  }

  private setStop(target: HTMLElement | undefined): void {
    for (const item of this.allItems()) {
      const value = item === target ? "0" : "-1";
      if (item.getAttribute("tabindex") !== value) item.setAttribute("tabindex", value);
    }
  }

  /** Keep exactly one tab stop, on a visible item. */
  private normalise(): void {
    const visible = this.visibleItems();
    if (visible.length === 0) return;
    const stops = this.allItems().filter((i) => i.getAttribute("tabindex") === "0");
    if (stops.length === 1 && this.isVisible(stops[0])) return;
    const keep =
      stops.find((i) => this.isVisible(i)) ??
      visible.find((i) => i.getAttribute("aria-selected") === "true") ??
      visible[0];
    this.setStop(keep);
  }

  private focusItem(item: HTMLElement | undefined): void {
    if (!item) return;
    this.setStop(item);
    item.focus();
  }

  protected onFocusin(event: FocusEvent): void {
    const item = (event.target as HTMLElement).closest<HTMLElement>("[role='treeitem']");
    if (item && this.tree().nativeElement.contains(item)) this.setStop(item);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const item = target.closest<HTMLElement>("[role='treeitem']");
    if (!item || !this.tree().nativeElement.contains(item)) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const visible = this.visibleItems();
    const index = visible.indexOf(item);
    const expanded = item.getAttribute("aria-expanded");

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusItem(visible[Math.min(index + 1, visible.length - 1)]);
        return;
      case "ArrowUp":
        event.preventDefault();
        this.focusItem(visible[Math.max(index - 1, 0)]);
        return;
      case "Home":
        event.preventDefault();
        this.focusItem(visible[0]);
        return;
      case "End":
        event.preventDefault();
        this.focusItem(visible[visible.length - 1]);
        return;
      case "ArrowRight":
        if (target !== item) return;
        event.preventDefault();
        if (expanded === "false") {
          item.setAttribute("aria-expanded", "true");
        } else if (expanded === "true") {
          this.focusItem(item.querySelector<HTMLElement>("[role='group'] [role='treeitem']") ?? undefined);
        }
        return;
      case "ArrowLeft":
        if (target !== item) return;
        event.preventDefault();
        if (expanded === "true") {
          item.setAttribute("aria-expanded", "false");
        } else {
          this.focusItem(this.parentItem(item) ?? undefined);
        }
        return;
      case "Enter":
      case " ":
        if (target !== item) return;
        event.preventDefault();
        item.click();
        return;
      case "*":
        event.preventDefault();
        for (const sibling of Array.from(item.parentElement?.children ?? [])) {
          if (sibling.getAttribute("role") === "treeitem" && sibling.getAttribute("aria-expanded") === "false") {
            sibling.setAttribute("aria-expanded", "true");
          }
        }
        return;
    }

    // Typeahead
    if (event.key.length === 1) {
      event.preventDefault();
      this.buffer += event.key.toLowerCase();
      clearTimeout(this.bufferTimer);
      this.bufferTimer = setTimeout(() => (this.buffer = ""), 500);
      const cycle = this.buffer.length === 1 || [...this.buffer].every((c) => c === this.buffer[0]);
      const needle = cycle ? this.buffer[0] : this.buffer;
      const split = index + (cycle ? 1 : 0);
      const ordered = [...visible.slice(split), ...visible.slice(0, split)];
      this.focusItem(ordered.find((i) => this.ownText(i).startsWith(needle)));
    }
  }
}
