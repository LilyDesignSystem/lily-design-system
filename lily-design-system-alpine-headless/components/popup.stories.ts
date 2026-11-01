import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div x-data="lilyPopover(false, { focus: true })" x-bind="root">\n  <button class="popup-trigger" x-bind="trigger" aria-controls="popup-1" command="toggle-popover" commandfor="popup-1" popovertarget="popup-1"><!-- Consumer provides trigger label --></button>\n  <div class="popup" id="popup-1" role="dialog" aria-label="" tabindex="-1" popover="auto" x-bind="panel">\n    <!-- Consumer provides content -->\n    <button class="popup-close" x-bind="closer"><!-- Consumer provides close label --></button>\n  </div>\n</div>';

const meta = {
    title: "Headless/Popup",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
