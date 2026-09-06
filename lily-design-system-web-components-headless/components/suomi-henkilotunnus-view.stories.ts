import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./suomi-henkilotunnus-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SuomiHenkilotunnusView",
    render: (args) => h("lily-suomi-henkilotunnus-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Henkilötunnus (HETU)",
        "value": "131052-308T"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
