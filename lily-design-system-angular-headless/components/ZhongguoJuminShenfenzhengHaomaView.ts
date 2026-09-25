import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ZhongguoJuminShenfenzhengHaomaView — a read-only display of China's Resident Identity Card Number (居民身份证号码)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `zhongguo-jumin-shenfenzheng-haoma-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-zhongguo-jumin-shenfenzheng-haoma-view",
  standalone: true,
  template: `<span class="zhongguo-jumin-shenfenzheng-haoma-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZhongguoJuminShenfenzhengHaomaView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
