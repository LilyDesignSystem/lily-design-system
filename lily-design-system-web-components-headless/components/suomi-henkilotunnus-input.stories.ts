import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./suomi-henkilotunnus-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SuomiHenkilotunnusInput",
    render: (args) => h("lily-suomi-henkilotunnus-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Henkilötunnus (HETU)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
