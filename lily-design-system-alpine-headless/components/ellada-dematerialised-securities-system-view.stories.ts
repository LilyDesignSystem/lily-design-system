import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="ellada-dematerialised-securities-system-view"\n  ><span class="screen-reader-span">Dematerialised Securities System </span></span\n>';

const meta = {
    title: "Headless/Ellada Dematerialised Securities System View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
