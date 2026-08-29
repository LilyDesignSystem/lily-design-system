import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { BackLink } from "../components/BackLink";
import { InsetText } from "../components/InsetText";
import { Field } from "../components/Field";
import { Label } from "../components/Label";
import { TextInput } from "../components/TextInput";
import { Button } from "../components/Button";

// RTL demo (plan P6-T4), ported from the canonical Svelte reference
// (lily-design-system-svelte-sveltekit-examples/src/routes/rtl-demo/+page.svelte).
// Proves the design principle in AGENTS/internationalization.md --
// "components do not assume LTR layout in their structural HTML" --
// with a real dir="rtl" page using components (breadcrumb, data table,
// pagination, a form with radios/checkboxes) that are the classic
// places a design system silently bakes in "left" instead of "start".
//
// One deliberate structural deviation from the Svelte reference: that
// app renders its own <Header>/<Footer> inside the dir="rtl" wrapper,
// because each SvelteKit route owns its full page shell. This app's
// shell (src/app/app.ts) renders the skip-link, header, and footer
// once, globally, outside <router-outlet> -- so the site chrome stays
// English/LTR and only this route's own content (the <article>) is
// wrapped dir="rtl" lang="ar". That is arguably the more realistic
// scenario anyway: a mixed-direction page, LTR chrome around RTL body
// content, exercising the same components under real direction
// inheritance rather than a full-page flip.
//
// Re-verified for this app, following the two findings recorded in the
// Svelte reference's own header comment (do not assume either holds
// here without checking):
//
// 1. Whether a legacy per-app CSS file is dead code here too: yes,
//    same finding as the Svelte app. This app DOES have an equivalent
//    -- src/styles/nhs.css, 2086 lines -- and grepping the whole src/
//    tree shows nothing imports it (only src/styles/app-shell.css is
//    imported, from src/main.ts; app-shell.css's own header comment
//    says as much: "Everything Lily-component-shaped comes from the
//    runtime theme stylesheet"). AGENTS.md's file-layout table still
//    lists nhs.css as live ("NHS UK CSS via single global
//    src/styles/nhs.css"); that line is now stale doc drift, left
//    unfixed here as a separate, larger cleanup than this route. The
//    real, live stylesheet is the same one the Svelte app uses: the
//    runtime-swapped root themes/*.css the theme-picker manages via
//    `<link data-lily-theme-picker="theme">`, copied into this app's
//    own public/themes/ for serving.
// 2. The shared default theme
//    (themes/united-kingdom-national-health-service-england-for-patients.css)
//    was already verified to use logical properties for breadcrumb
//    separators, table headers, and inset-text when the Svelte route
//    was built -- confirmed unchanged and correct for this app's own
//    real computed styles (see e2e/rtl-demo.spec.ts). No shared-theme
//    change was needed.
//
// Wrapper-host workarounds (spec/index.md §11.8): this app's element-
// selector Angular components wrap a native element inside their own
// host tag, breaking any construct that depends on direct parent-child
// structure. Breadcrumb, data-table, and pagination all hit this the
// same way StepList/SummaryList do in book-an-appointment.ts, so all
// three use direct class-hook markup here instead of their wrapper
// components:
//   - BreadcrumbList/BreadcrumbListItem: <lily-breadcrumb-list> would
//     sit between <ol> and <li>.
//   - DataTableHead/DataTableBody/DataTableRow: <lily-data-table-row>
//     would sit between <thead>/<tbody> and <tr>, and there is no
//     table-model exception for it -- so the table skips ALL of the
//     DataTable* family, not just the row/head/body layer, and uses a
//     plain <table class="data-table"> for the same reason.
//   - PaginationList/PaginationListItem: <lily-pagination-list-item>
//     would sit between <ol> and <li>.
// RadioInput/CheckboxInput/RadioGroup have the same missing
// checked/name model documented in book-an-appointment.ts, so the
// contact-method radios and the terms checkbox are plain native
// <input> elements carrying the class hooks (`radio-group`,
// `radio-input`, `checkbox-input`), each wrapped in a real native
// <label class="label"> for click-target + accessible-name parity,
// exactly as book-an-appointment.ts does. BackLink, InsetText, Field,
// Label (as a wrapping decorative element, not a `for` association),
// TextInput, and Button render a single native element with no nested
// structure to break, so they're used as components directly.
@Component({
  selector: "lily-rtl-demo",
  standalone: true,
  imports: [BackLink, InsetText, Field, Label, TextInput, Button],
  template: `
    <article class="page-wrapper" dir="rtl" lang="ar">
      <lily-back-link href="/">رجوع إلى الأمثلة</lily-back-link>

      <h1>عرض توضيحي للكتابة من اليمين إلى اليسار</h1>

      <!-- Direct class-hook markup: breadcrumb-list's wrapper-host
           issue, see file header. -->
      <nav class="breadcrumb-nav" aria-label="مسار التصفح">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-list-item"><a href="/">الرئيسية</a></li>
          <li class="breadcrumb-list-item"><a href="/components">الإعدادات</a></li>
          <li class="breadcrumb-list-item" aria-current="page">الملف الشخصي</li>
        </ol>
      </nav>

      <lily-inset-text>
        هذه صفحة تجريبية لاختبار الاتجاه من اليمين إلى اليسار. جميع
        المكوّنات هنا بلا تنسيق مسبق؛ التنسيق البصري كله من هذا التطبيق.
      </lily-inset-text>

      <h2>جدول الموظفين</h2>

      <!-- Direct class-hook markup: data-table's wrapper-host issue,
           see file header. -->
      <table class="data-table" aria-label="قائمة الموظفين">
        <thead class="data-table-head">
          <tr class="data-table-row">
            <th class="data-table-th" scope="col">الاسم</th>
            <th class="data-table-th" scope="col">القسم</th>
            <th class="data-table-th" scope="col">الحالة</th>
          </tr>
        </thead>
        <tbody class="data-table-body">
          @for (row of rows; track row.name) {
            <tr class="data-table-row">
              <td class="data-table-td">{{ row.name }}</td>
              <td class="data-table-td">{{ row.department }}</td>
              <td class="data-table-td">{{ row.status }}</td>
            </tr>
          }
        </tbody>
      </table>

      <!-- Direct class-hook markup: pagination-list's wrapper-host
           issue, see file header. Plain page numbers, word labels
           only -- no directional arrow glyphs to sidestep glyph-
           direction issues entirely. -->
      <nav class="pagination-nav" aria-label="ترقيم صفحات النتائج">
        <ol class="pagination-list" aria-label="قائمة الصفحات">
          @for (page of pages; track page) {
            <li class="pagination-list-item">
              @if (page === currentPage) {
                <span aria-current="page">{{ page }}</span>
              } @else {
                <a [href]="'#page-' + page">{{ page }}</a>
              }
            </li>
          }
        </ol>
      </nav>

      <h2>نموذج التواصل</h2>

      <form class="form" aria-label="نموذج التواصل" (submit)="onSubmit($event)" novalidate>
        <lily-field>
          <lily-label>الاسم الكامل</lily-label>
          <lily-text-input label="الاسم الكامل" [(value)]="name" />
        </lily-field>

        <!-- Direct class-hook markup: RadioGroup/RadioInput have no
             checked/name model, see file header. -->
        <fieldset class="fieldset">
          <legend>طريقة التواصل المفضلة</legend>
          <div class="radio-group" role="radiogroup" aria-label="طريقة التواصل المفضلة">
            <label class="label">
              <input
                type="radio"
                class="radio-input"
                name="contact-method"
                value="email"
                [checked]="contactMethod() === 'email'"
                (change)="contactMethod.set('email')"
                aria-label="البريد الإلكتروني"
              />
              البريد الإلكتروني
            </label>
            <label class="label">
              <input
                type="radio"
                class="radio-input"
                name="contact-method"
                value="phone"
                [checked]="contactMethod() === 'phone'"
                (change)="contactMethod.set('phone')"
                aria-label="الهاتف"
              />
              الهاتف
            </label>
          </div>
        </fieldset>

        <p>
          <label class="label">
            <input
              type="checkbox"
              class="checkbox-input"
              [checked]="agreeTerms()"
              (change)="agreeTerms.set($any($event.target).checked)"
              aria-label="أوافق على الشروط"
            />
            أوافق على الشروط
          </label>
        </p>

        <p><lily-button (click)="onSubmit($event)">إرسال</lily-button></p>
      </form>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RtlDemoPage {
  protected readonly rows = [
    { name: "سارة أحمد", department: "الموارد البشرية", status: "نشط" },
    { name: "محمد علي", department: "تقنية المعلومات", status: "نشط" },
    { name: "ليلى حسن", department: "المالية", status: "متوقف" },
  ];

  protected readonly pages = [1, 2, 3, 4, 5];
  protected readonly currentPage = 2;

  protected readonly name = signal("");
  protected readonly contactMethod = signal<"email" | "phone">("email");
  protected readonly agreeTerms = signal(false);

  protected onSubmit(event: Event): void {
    event.preventDefault();
  }
}
