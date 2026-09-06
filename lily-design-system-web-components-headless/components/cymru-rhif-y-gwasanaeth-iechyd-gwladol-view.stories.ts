import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./cymru-rhif-y-gwasanaeth-iechyd-gwladol-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/CymruRhifYGwasanaethIechydGwladolView",
    render: (args) => h("lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rhif y Gwasanaeth Iechyd Gwladol",
        "value": "943 476 5919"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
