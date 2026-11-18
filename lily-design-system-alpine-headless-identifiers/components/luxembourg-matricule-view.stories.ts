import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="luxembourg-matricule-view"\n  ><span class="screen-reader-span">Numéro d\'Identification Nationale (Matricule) </span></span\n>';

const meta = {
    title: "Headless/Luxembourg Matricule View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
