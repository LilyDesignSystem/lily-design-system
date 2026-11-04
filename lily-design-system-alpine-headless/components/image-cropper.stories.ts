import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="image-cropper"\n  role="application"\n  aria-label=""\n  tabindex="0"\n  x-lily-cropper\n>\n  <!-- Consumer provides the image and the crop overlay (canvas, SVG handles or a cropping library) -->\n</div>';

const meta = {
    title: "Headless/Image Cropper",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
