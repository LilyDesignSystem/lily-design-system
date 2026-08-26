import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Fieldset } from "../components/Fieldset";
import { Field } from "../components/Field";
import { Label } from "../components/Label";
import { SwitchButton } from "../components/SwitchButton";
import { RadioGroup } from "../components/RadioGroup";
import { RadioInput } from "../components/RadioInput";
import { Select } from "../components/Select";
import { Option } from "../components/Option";
import { Banner } from "../components/Banner";

@Component({
  selector: "lily-settings-page",
  standalone: true,
  imports: [Fieldset, Field, Label, SwitchButton, RadioGroup, RadioInput, Select, Option, Banner],
  template: `
    <article class="page-wrapper">
      <h1>Settings</h1>

      <lily-banner label="Profile">Profile last updated today.</lily-banner>

      <lily-fieldset label="Theme">
        <lily-field>
          <lily-label>Dark mode</lily-label>
          <lily-switch-button label="Dark mode" />
        </lily-field>
        <lily-field>
          <lily-label>Density</lily-label>
          <lily-radio-group label="Density">
            <lily-radio-input label="Compact" />
            <lily-radio-input label="Comfortable" />
          </lily-radio-group>
        </lily-field>
        <lily-field>
          <lily-label>Language</lily-label>
          <lily-select label="Language">
            <lily-option value="en">English</lily-option>
            <lily-option value="fr">Français</lily-option>
          </lily-select>
        </lily-field>
      </lily-fieldset>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsPagePage {

}
