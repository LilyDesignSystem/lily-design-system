import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./romania-pasaport-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/RomaniaPasaportInput",
    render: (args) => h("lily-romania-pasaport-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Pașaport"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
