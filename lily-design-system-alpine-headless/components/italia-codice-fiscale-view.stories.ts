import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="italia-codice-fiscale-view"\n  ><span class="screen-reader-span">Italian Fiscal Code </span></span\n>';

const meta = {
    title: "Headless/Italia Codice Fiscale View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
