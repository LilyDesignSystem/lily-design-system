import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="belgique-numero-de-registre-national-view"\n  ><span class="screen-reader-span">National Register Number </span></span\n>';

const meta = {
    title: "Headless/Belgique Numero De Registre National View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
