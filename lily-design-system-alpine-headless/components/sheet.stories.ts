import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div x-data="lilyModalSurface(false)">\n  <button class="sheet-trigger" x-bind="trigger" aria-controls="sheet-1"><!-- Consumer provides trigger label --></button>\n  <dialog class="sheet" id="sheet-1" aria-label="" tabindex="-1" data-side="bottom" x-bind="surface">\n    <!-- Consumer provides content -->\n    <button class="sheet-close" x-bind="closer"><!-- Consumer provides close label --></button>\n  </dialog>\n</div>';

const meta = {
    title: "Headless/Sheet",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
