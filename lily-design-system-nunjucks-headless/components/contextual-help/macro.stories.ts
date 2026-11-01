import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="contextual-help">
  <button
    class="contextual-help-trigger"
    type="button"
    aria-label="Help"
    aria-haspopup="dialog"
    aria-controls="contextual-help-panel" command="toggle-popover" commandfor="contextual-help-panel" popovertarget="contextual-help-panel"  >?</button>
  <div
    class="contextual-help-panel"
    id="contextual-help-panel"
    role="dialog" popover="auto"  ><p>Help content explaining the related field.</p></div>
</div>`;

const meta = {
    title: "Headless/ContextualHelp",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
