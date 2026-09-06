import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./image-cropper.js";
import { h } from "../stories/render.js";

const SLOT = '<img src="https://placehold.co/400x400" alt="Photo to crop" />';

const meta: Meta = {
    title: "Content/ImageCropper",
    render: (args) => h("lily-image-cropper", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Crop your profile photo",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
