import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { DateField } from "../components/DateField";
import { Field } from "../components/Field";
import { FileUpload } from "../components/FileUpload";
import { InputWithMask } from "../components/InputWithMask";
import { NetPromoterScorePicker } from "../components/NetPromoterScorePicker";
import { PasswordInputOrTextInputDiv } from "../components/PasswordInputOrTextInputDiv";
import { RedAmberGreenPicker } from "../components/RedAmberGreenPicker";
import { RedOrangeYellowGreenBluePicker } from "../components/RedOrangeYellowGreenBluePicker";
import { SelectWithExtras } from "../components/SelectWithExtras";
import { TagInputDiv } from "../components/TagInputDiv";
import { TaskListItem } from "../components/TaskListItem";
import { TextAreaInputWithCharacterCounter } from "../components/TextAreaInputWithCharacterCounter";
import { TextInputWithSearch } from "../components/TextInputWithSearch";
import { TourListItem } from "../components/TourListItem";

// Inputs made of several parts. e2e/composed-inputs.spec.ts drives this page.
@Component({
    selector: "lily-composed-inputs",
    standalone: true,
    imports: [
        DateField,
        Field,
        FileUpload,
        InputWithMask,
        NetPromoterScorePicker,
        PasswordInputOrTextInputDiv,
        RedAmberGreenPicker,
        RedOrangeYellowGreenBluePicker,
        SelectWithExtras,
        TagInputDiv,
        TaskListItem,
        TextAreaInputWithCharacterCounter,
        TextInputWithSearch,
        TourListItem,
    ],
    template: `
    <article class="page-wrapper">
      <h1>Composed inputs</h1>

      <form (submit)="$event.preventDefault(); submits.set(submits() + 1)">
        <lily-text-input-with-search label="Site" inputLabel="Terms" searchLabel="Search" [(value)]="terms" (search)="searched.set($event)" data-testid="search" />
        <button type="submit">Send</button>
      </form>
      <p data-testid="search-state">Searched: {{ searched() }}, submits: {{ submits() }}</p>

      <lily-password-input-or-text-input-div label="Password" toggleLabel="Show password" [(value)]="password" data-testid="password" />
      <p data-testid="password-state">Password: {{ password() }}</p>

      <lily-text-area-input-with-character-counter label="Notes" [maxLength]="10" counterTemplate="{count} of {max}" [(value)]="notes" data-testid="notes" />

      <lily-input-with-mask label="Phone" mask="___-____" [(value)]="phone" data-testid="mask" />
      <p data-testid="mask-state">Phone: {{ phone() }}</p>

      <lily-select-with-extras label="Colour" [(value)]="colour" data-testid="extras">
        <span before>Before</span>
        <option value="">Choose</option>
        <option value="red">Red</option>
        <span after>After</span>
      </lily-select-with-extras>
      <p data-testid="extras-state">Colour: {{ colour() }}</p>

      <lily-date-field label="Birthday" dayLabel="Day" monthLabel="Month" yearLabel="Year" order="dmy" autocomplete="bday" description="Your date of birth" [error]="date() ? '' : 'Enter a date'" [(value)]="date" data-testid="date" />
      <p data-testid="date-state">Date: {{ date() }}</p>

      <lily-field label="Town" inputId="town" [required]="true" description="Where you live" error="Enter a town" data-testid="field">
        <input id="town" type="text" />
      </lily-field>

      <lily-file-upload label="Choose files" [multiple]="true" [selectedLabel]="chosen" data-testid="upload" />

      <lily-net-promoter-score-picker label="Score" [(value)]="score" data-testid="nps" />
      <p data-testid="nps-state">Score: {{ score() }}</p>

      <lily-red-amber-green-picker label="Status" [statusLabel]="statusText" [(value)]="rag" data-testid="rag" />
      <p data-testid="rag-state">Status: {{ rag() }}</p>

      <lily-red-orange-yellow-green-blue-picker label="Rating" [statusLabel]="statusText" [(value)]="roygb" data-testid="roygb" />
      <p data-testid="roygb-state">Rating: {{ roygb() }}</p>

      <ol>
        <li lily-task-list-item label="Write" [(checked)]="task" data-testid="task"></li>
      </ol>
      <p data-testid="task-state">Task: {{ task() }}</p>

      <ol>
        <li lily-tour-list-item label="One" [current]="step() === 1"><p>First step</p></li>
        <li lily-tour-list-item label="Two" [current]="step() === 2"><p>Second step</p></li>
      </ol>
      <button type="button" data-testid="next" (click)="step.set(2)">Next</button>

      <lily-tag-input-div label="Tags" [(value)]="tagText" (added)="tags.set([...tags(), $event])" data-testid="tags">
        @for (tag of tags(); track tag) {
          <span class="tag">{{ tag }}</span>
        }
      </lily-tag-input-div>
    </article>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComposedInputsPage {
    protected readonly tagText = signal("");
    protected readonly tags = signal<string[]>([]);
    protected readonly terms = signal("");
    protected readonly searched = signal("");
    protected readonly submits = signal(0);
    protected readonly password = signal("");
    protected readonly notes = signal("");
    protected readonly phone = signal("");
    protected readonly colour = signal("");
    protected readonly date = signal("");
    protected readonly score = signal("");
    protected readonly rag = signal("");
    protected readonly roygb = signal("");
    private readonly statusWords: Record<string, string> = {
        red: "Red",
        amber: "Amber",
        orange: "Orange",
        yellow: "Yellow",
        green: "Green",
        blue: "Blue",
    };
    protected readonly statusText = (status: string): string => this.statusWords[status];
    protected readonly task = signal(false);
    protected readonly step = signal(1);
    protected readonly chosen = (count: number) => `Chosen: ${count}`;
}
