import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, forwardRef, inject, input, model, signal, viewChild } from "@angular/core";
import { FilterGroupView } from "./filter-group-view.component";
import { FilterHost, type FilterLabels } from "./filter-host";
import {
  EMPTY_FILTER, addNode, createGroup, createRule, formatFilter, removeNode, updateNode,
  type FilterField, type FilterGroup, type FilterOutputFormat, type FilterRule, type SqlDialect,
} from "./filter-model";

export type { FilterLabels } from "./filter-host";

/** The number the user sees for each rule: its place in reading order across the whole filter. */
function numberRules(root: FilterGroup): Map<string, number> {
  const numbers = new Map<string, number>();
  let n = 0;
  const walk = (g: FilterGroup) => {
    for (const child of g.children) {
      if (child.type === "rule") numbers.set(child.id, ++n);
      else walk(child);
    }
  };
  walk(root);
  return numbers;
}

/**
 * A headless filter builder: conditions and groups over typed fields, written out as JSON, SQL, MongoDB, OData or a predicate.
 * `[(value)]` binds the filter; every change is a new object, never a mutation (`valueChange` reports it).
 */
@Component({
  selector: "lily-filter",
  standalone: true,
  imports: [FilterGroupView],
  providers: [{ provide: FilterHost, useExisting: forwardRef(() => Filter) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #rootEl class="filter {{ className() }}" role="group" [attr.aria-label]="label()" [attr.data-readonly]="readonly() ? '' : null">
      <lily-filter-group-view [group]="value()" [depth]="1" [parentId]="null" />
      @if (format() && labels().output) {
        <div class="filter-output" role="group" [attr.aria-label]="labels().output" [attr.data-format]="format()">
          <pre class="filter-output-text">{{ output() }}</pre>
        </div>
      }
      <p class="filter-status" aria-live="polite">{{ status() }}</p>
    </div>
  `,
})
export class Filter extends FilterHost {
  /** Accessible name of the whole filter. */
  readonly label = input.required<string>();
  /** What can be filtered on. */
  readonly fields = input.required<FilterField[]>();
  readonly labels = input.required<FilterLabels>();
  /** The filter. Two-way bindable. */
  readonly value = model<FilterGroup>(EMPTY_FILTER());
  /** Show the filter written out in this format under the builder. Needs `labels.output`. */
  readonly format = input<FilterOutputFormat | undefined>(undefined);
  /** SQL dialect for `format="sql"`. Default `ansi`. */
  readonly dialect = input<SqlDialect>("ansi");
  /** The deepest group nesting offered (1 = no nested groups). Default 3. */
  readonly maxDepth = input<number>(3);
  /** Show the filter without letting it be edited. */
  readonly readonly = input<boolean>(false);
  readonly className = input<string>("");

  protected readonly status = signal("");
  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly injector = inject(Injector);

  private readonly fieldMap = computed(() => new Map(this.fields().map((f) => [f.id, f])));
  private readonly numbers = computed(() => numberRules(this.value()));
  protected readonly output = computed(() => {
    const format = this.format();
    return format && this.labels().output ? formatFilter(this.value(), this.fields(), format, this.dialect()) : "";
  });

  // ---- FilterHost ----
  override isReadonly(): boolean {
    return this.readonly();
  }
  override maxDepthValue(): number {
    return this.maxDepth();
  }
  override fieldOf(id: string): FilterField | undefined {
    return this.fieldMap().get(id);
  }
  override ruleNumber(id: string): number {
    return this.numbers().get(id) ?? 0;
  }

  private announce(message: string | undefined): void {
    if (message) this.status.set(message);
  }

  private focusLater(selector: string): void {
    afterNextRender(() => this.rootRef().nativeElement.querySelector<HTMLElement>(selector)?.focus(), { injector: this.injector });
  }

  override setRule(id: string, change: (rule: FilterRule) => FilterRule): void {
    if (this.readonly()) return;
    this.value.set(updateNode(this.value(), id, (node) => (node.type === "rule" ? change(node) : node)));
  }
  override setGroup(id: string, change: (group: FilterGroup) => FilterGroup): void {
    if (this.readonly()) return;
    this.value.set(updateNode(this.value(), id, (node) => (node.type === "group" ? change(node) : node)));
  }
  override addRule(groupId: string): void {
    if (this.readonly() || this.fields().length === 0) return;
    const rule = createRule(this.fields());
    const next = addNode(this.value(), groupId, rule);
    this.value.set(next);
    this.announce(this.labels().ruleAdded?.(numberRules(next).get(rule.id) ?? 0));
    this.focusLater(`[data-filter-field="${rule.id}"]`);
  }
  override addGroup(parentId: string, depth: number): void {
    if (this.readonly() || depth >= this.maxDepth()) return;
    const group = createGroup("and", this.fields().length ? [createRule(this.fields())] : []);
    this.value.set(addNode(this.value(), parentId, group));
    this.announce(this.labels().groupAdded?.(depth + 1));
    const first = group.children[0];
    if (first) this.focusLater(`[data-filter-field="${first.id}"]`);
  }
  override removeRule(rule: FilterRule, groupId: string): void {
    if (this.readonly()) return;
    const n = this.ruleNumber(rule.id);
    this.value.set(removeNode(this.value(), rule.id));
    this.announce(this.labels().ruleRemoved?.(n));
    this.focusLater(`[data-filter-add-rule="${groupId}"]`);
  }
  override removeGroup(group: FilterGroup, parentId: string, depth: number): void {
    if (this.readonly()) return;
    this.value.set(removeNode(this.value(), group.id));
    this.announce(this.labels().groupRemoved?.(depth));
    this.focusLater(`[data-filter-add-rule="${parentId}"]`);
  }
}
