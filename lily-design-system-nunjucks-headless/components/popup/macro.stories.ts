import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<button type="button" aria-haspopup="dialog" aria-controls="popup-1" command="toggle-popover" commandfor="popup-1" popovertarget="popup-1">Show details</button>
<div
  class="popup"
  role="dialog" aria-label="Details" popover="auto" id="popup-1"><p>Popup content</p></div>`;

const meta = {
    title: "Headless/Popup",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
