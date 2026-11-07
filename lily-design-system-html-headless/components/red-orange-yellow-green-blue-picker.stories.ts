import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<fieldset
  class="red-orange-yellow-green-blue-picker"
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
      value="orange"
    />
    orange</label
  >
  <label
    ><input
      type="radio"
      name="status"
      value="yellow"
    />
    yellow</label
  >
  <label
    ><input
      type="radio"
      name="status"
      value="green"
    />
    green</label
  >
  <label
    ><input
      type="radio"
      name="status"
      value="blue"
    />
    blue</label
  >
</fieldset>`;

const meta = {
    title: "Headless/RedOrangeYellowGreenBluePicker",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
