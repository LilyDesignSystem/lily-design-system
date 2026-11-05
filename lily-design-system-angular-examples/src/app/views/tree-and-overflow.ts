import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { AccordionCheckbox } from "../components/AccordionCheckbox";
import { MiddleTruncation } from "../components/MiddleTruncation";
import { NavigationMenu } from "../components/NavigationMenu";
import { TreeList } from "../components/TreeList";
import { TreeListItem } from "../components/TreeListItem";

// An option that reveals a panel, a menu that overflows, shortened text and a tree, driven by e2e/tree-and-overflow.spec.ts.
// The themes style the menu and the shortened text; the demo only bounds their width.
@Component({
    selector: "lily-tree-and-overflow",
    standalone: true,
    imports: [AccordionCheckbox, MiddleTruncation, NavigationMenu, TreeList, TreeListItem],
    template: `
    <article class="page-wrapper">
      <h1>Tree and overflow</h1>

      <form data-testid="accordion-form">
        <lily-accordion-checkbox label="Send me updates" [(checked)]="updates" data-testid="accordion">
          <textarea aria-label="Topics"></textarea>
        </lily-accordion-checkbox>
        <button type="reset">Reset</button>
      </form>
      <p data-testid="accordion-state">Updates: {{ updates() }}</p>

      <div data-testid="nav-box">
        <lily-navigation-menu label="Sections" [overflow]="true" moreLabel="More">
          @for (item of items; track item) {
            <li><a [href]="'#' + item" [attr.aria-current]="item === 'Results' ? 'page' : null">{{ item }}</a></li>
          }
        </lily-navigation-menu>
      </div>
      <p>After the menu</p>

      <div data-testid="truncation">
        <lily-middle-truncation
          text="report-final-version-of-the-third-quarter-for-the-board.pdf"
          ellipsis="…"
          strategy="min-end"
          [end]="4"
        />
      </div>

      <lily-tree-list label="Files" data-testid="tree">
        <li lily-tree-list-item label="Documents" tabindex="0" [(expanded)]="documents" id="documents">
          Documents
          <ol role="group" [hidden]="!documents()">
            <li lily-tree-list-item label="Budget" id="budget">Budget</li>
          </ol>
        </li>
        <li lily-tree-list-item label="Music" id="music">Music</li>
      </lily-tree-list>

      <div dir="rtl">
        <lily-tree-list label="Right to left">
          <li lily-tree-list-item label="Branch" tabindex="0" [(expanded)]="rtlBranch" id="rtl-branch">
            Branch
            <ol role="group" [hidden]="!rtlBranch()">
              <li lily-tree-list-item label="Leaf" id="rtl-leaf">Leaf</li>
            </ol>
          </li>
        </lily-tree-list>
      </div>
    </article>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TreeAndOverflow {
    protected readonly updates = signal(false);
    protected readonly documents = signal<boolean | undefined>(false);
    protected readonly rtlBranch = signal<boolean | undefined>(false);
    protected readonly items = ["Overview", "Patients", "Appointments", "Results", "Messages", "Reports", "Settings", "Support"];
}
