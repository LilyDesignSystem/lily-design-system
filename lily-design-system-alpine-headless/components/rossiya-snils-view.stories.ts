import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="rossiya-snils-view"\n  ><span class="screen-reader-span"\n    >СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)\n  </span></span\n>';

const meta = {
    title: "Headless/Rossiya Snils View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
