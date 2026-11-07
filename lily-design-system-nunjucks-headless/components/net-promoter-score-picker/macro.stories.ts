import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<fieldset class="net-promoter-score-picker" role="radiogroup" aria-label="Rating">
  <label><input type="radio" name="nps" value="0" /> 0</label>
  <label><input type="radio" name="nps" value="1" /> 1</label>
  <label><input type="radio" name="nps" value="2" /> 2</label>
  <label><input type="radio" name="nps" value="3" /> 3</label>
  <label><input type="radio" name="nps" value="4" /> 4</label>
  <label><input type="radio" name="nps" value="5" /> 5</label>
  <label><input type="radio" name="nps" value="6" /> 6</label>
  <label><input type="radio" name="nps" value="7" /> 7</label>
  <label><input type="radio" name="nps" value="8" /> 8</label>
  <label><input type="radio" name="nps" value="9" /> 9</label>
  <label><input type="radio" name="nps" value="10" /> 10</label>
</fieldset>`;

const meta = {
    title: "Headless/NetPromoterScorePicker",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
