import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<button type="button" aria-haspopup="dialog" aria-controls="popover-1" command="toggle-popover" commandfor="popover-1" popovertarget="popover-1">Show details</button>
<div
  class="popover"
  id="popover-1"
  role="dialog"
  popover="auto" aria-label="Details"><p>Popover content</p></div>`;

const meta = {
    title: "Headless/Popover",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
