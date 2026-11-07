import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<fieldset class="five-face-rating-picker" role="radiogroup" aria-label="Rating">
  <label><input type="radio" name="face-rating" value="1" /> 1</label>
  <label><input type="radio" name="face-rating" value="2" /> 2</label>
  <label><input type="radio" name="face-rating" value="3" /> 3</label>
  <label><input type="radio" name="face-rating" value="4" /> 4</label>
  <label><input type="radio" name="face-rating" value="5" /> 5</label>
</fieldset>`;

const meta = {
    title: "Headless/FiveFaceRatingPicker",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
