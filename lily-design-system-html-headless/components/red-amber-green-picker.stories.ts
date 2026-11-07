import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<fieldset
  class="red-amber-green-picker"
  role="radiogroup"
  aria-label=""
>
  <label
    ><input
      type="radio"
      name="status"
      value="red"
    />
    red</label
  >
  <label
    ><input
      type="radio"
      name="status"
      value="amber"
    />
    amber</label
  >
  <label
    ><input
      type="radio"
      name="status"
      value="green"
    />
    green</label
  >
</fieldset>`;

const meta = {
    title: "Headless/RedAmberGreenPicker",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
