import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="france-numero-d-identification-au-repertoire-view"\n  ><span class="screen-reader-span"> </span\n></span>';

const meta = {
    title: "Headless/France Numero DIdentification Au Repertoire View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
