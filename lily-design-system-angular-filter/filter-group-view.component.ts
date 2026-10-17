import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from "@angular/core";
import { changeField, changeOperator, fieldType, operatorsFor, valueArity, type FilterField, type FilterGroup, type FilterOperator, type FilterRule } from "./filter-model";
import { FilterHost, parseTyped, textOf } from "./filter-host";

/** One group of the filter, and (by recursion) its nested groups. Internal: use `Filter`. */
@Component({
  selector: "lily-filter-group-view",
  standalone: true,
  imports: [forwardRef(() => FilterGroupView)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filter-group" role="group" [attr.aria-label]="host.labels().group(depth())" [attr.data-depth]="depth()" [attr.data-group-id]="group().id">
      <div class="filter-group-header">
        <select class="filter-combinator" [attr.aria-label]="host.labels().combinator" [disabled]="host.isReadonly()" [value]="group().combinator"
          (change)="host.setGroup(group().id, withCombinator($event))">
          <option value="and" [selected]="group().combinator === 'and'">{{ host.labels().and }}</option>
          <option value="or" [selected]="group().combinator === 'or'">{{ host.labels().or }}</option>
        </select>
        <label class="filter-not">
          <input type="checkbox" [disabled]="host.isReadonly()" [checked]="!!group().not" (change)="host.setGroup(group().id, withNot($event))" />
          {{ host.labels().not }}
        </label>
        @if (parentId() !== null && !host.isReadonly()) {
          <button type="button" class="filter-remove-group-button" (click)="host.removeGroup(group(), parentId()!, depth())">{{ host.labels().removeGroup(depth()) }}</button>
        }
      </div>
      @if (group().children.length === 0 && host.labels().empty) {
        <p class="filter-empty">{{ host.labels().empty }}</p>
      }
      <ul class="filter-rules">
        @for (child of group().children; track child.id) {
          <li class="filter-item">
            @if (isGroup(child)) {
              <lily-filter-group-view [group]="asGroup(child)" [depth]="depth() + 1" [parentId]="group().id" />
            } @else {
              @let rule = asRule(child);
              @let field = host.fieldOf(rule.field);
              <div class="filter-rule" role="group" [attr.aria-label]="host.labels().rule(host.ruleNumber(rule.id))" [attr.data-rule-id]="rule.id">
                <select class="filter-field" [attr.data-filter-field]="rule.id" [attr.aria-label]="host.labels().field" [disabled]="host.isReadonly()" [value]="rule.field"
                  (change)="host.setRule(rule.id, withField($event))">
                  @for (f of host.fields(); track f.id) {
                    <option [value]="f.id" [selected]="f.id === rule.field">{{ f.label }}</option>
                  }
                </select>
                @if (field) {
                  <select class="filter-operator" [attr.aria-label]="host.labels().operator" [disabled]="host.isReadonly()" [value]="rule.operator"
                    (change)="host.setRule(rule.id, withOperator($event))">
                    @for (op of operators(field); track op) {
                      <option [value]="op" [selected]="op === rule.operator">{{ host.labels().operatorName(op, field) }}</option>
                    }
                  </select>
                  @if (arity(rule) === 1 || arity(rule) === 2) {
                    @if (typeOf(field) === 'select') {
                      <select class="filter-value" [attr.aria-label]="host.labels().value" [disabled]="host.isReadonly()" [value]="text(rule.value)"
                        (change)="host.setRule(rule.id, withValue($event, 'text'))">
                        <option value="">{{ host.labels().choose ?? '' }}</option>
                        @for (option of field.options ?? []; track option.id) {
                          <option [value]="option.id" [selected]="option.id === text(rule.value)">{{ option.label }}</option>
                        }
                      </select>
                    } @else {
                      <input class="filter-value" [type]="inputType(field)" [attr.inputmode]="typeOf(field) === 'number' ? 'decimal' : null"
                        [attr.aria-label]="arity(rule) === 2 ? host.labels().valueFrom : host.labels().value" [readOnly]="host.isReadonly()" [value]="text(rule.value)"
                        (input)="host.setRule(rule.id, withValue($event, typeOf(field)))" />
                      @if (arity(rule) === 2) {
                        <input class="filter-value filter-value-to" [type]="inputType(field)" [attr.inputmode]="typeOf(field) === 'number' ? 'decimal' : null"
                          [attr.aria-label]="host.labels().valueTo" [readOnly]="host.isReadonly()" [value]="text(rule.value2)"
                          (input)="host.setRule(rule.id, withValue2($event, typeOf(field)))" />
                      }
                    }
                  } @else if (arity(rule) === 'many') {
                    <div class="filter-choices" role="group" [attr.aria-label]="host.labels().value">
                      @for (option of field.options ?? []; track option.id) {
                        <label class="filter-choice">
                          <input type="checkbox" [disabled]="host.isReadonly()" [checked]="isChosen(rule, option.id)" (change)="toggle(rule, option.id, $event)" />
                          {{ option.label }}
                        </label>
                      }
                    </div>
                  }
                }
                @if (!host.isReadonly()) {
                  <button type="button" class="filter-remove-rule-button" (click)="host.removeRule(rule, group().id)">{{ host.labels().removeRule(host.ruleNumber(rule.id)) }}</button>
                }
              </div>
            }
          </li>
        }
      </ul>
      @if (!host.isReadonly()) {
        <div class="filter-group-actions">
          <button type="button" class="filter-add-rule-button" [attr.data-filter-add-rule]="group().id" (click)="host.addRule(group().id)">{{ host.labels().addRule }}</button>
          @if (depth() < host.maxDepthValue()) {
            <button type="button" class="filter-add-group-button" (click)="host.addGroup(group().id, depth())">{{ host.labels().addGroup }}</button>
          }
        </div>
      }
    </div>
  `,
})
export class FilterGroupView {
  readonly group = input.required<FilterGroup>();
  readonly depth = input.required<number>();
  readonly parentId = input.required<string | null>();
  protected readonly host = inject(FilterHost);

  protected isGroup(node: FilterGroup | FilterRule): boolean {
    return node.type === "group";
  }
  protected asGroup(node: FilterGroup | FilterRule): FilterGroup {
    return node as FilterGroup;
  }
  protected asRule(node: FilterGroup | FilterRule): FilterRule {
    return node as FilterRule;
  }
  protected operators(field: FilterField): FilterOperator[] {
    return operatorsFor(field);
  }
  protected arity(rule: FilterRule): 0 | 1 | 2 | "many" {
    return valueArity(rule.operator);
  }
  protected typeOf(field: FilterField): string {
    return fieldType(field);
  }
  protected inputType(field: FilterField): string {
    const t = fieldType(field);
    return t === "number" ? "number" : t === "date" ? "date" : "text";
  }
  protected text(v: unknown): string {
    return textOf(v);
  }
  protected isChosen(rule: FilterRule, id: string): boolean {
    return Array.isArray(rule.value) && (rule.value as string[]).includes(id);
  }

  private raw(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected withCombinator(event: Event): (g: FilterGroup) => FilterGroup {
    const v = this.raw(event) === "or" ? "or" : "and";
    return (g) => ({ ...g, combinator: v });
  }
  protected withNot(event: Event): (g: FilterGroup) => FilterGroup {
    const checked = (event.target as HTMLInputElement).checked;
    return (g) => ({ ...g, not: checked || undefined });
  }
  protected withField(event: Event): (r: FilterRule) => FilterRule {
    const id = this.raw(event);
    return (r) => changeField(r, this.host.fields(), id);
  }
  protected withOperator(event: Event): (r: FilterRule) => FilterRule {
    const op = this.raw(event) as FilterOperator;
    return (r) => changeOperator(r, op);
  }
  protected withValue(event: Event, type: string): (r: FilterRule) => FilterRule {
    const v = parseTyped(type, this.raw(event));
    return (r) => ({ ...r, value: v });
  }
  protected withValue2(event: Event, type: string): (r: FilterRule) => FilterRule {
    const v = parseTyped(type, this.raw(event));
    return (r) => ({ ...r, value2: v });
  }
  protected toggle(rule: FilterRule, optionId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = Array.isArray(rule.value) ? (rule.value as string[]) : [];
    const next = checked ? [...current.filter((v) => v !== optionId), optionId] : current.filter((v) => v !== optionId);
    this.host.setRule(rule.id, (r) => ({ ...r, value: next.length ? next : undefined }));
  }
}
