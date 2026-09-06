import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./cymru-rhif-y-gwasanaeth-iechyd-gwladol-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/CymruRhifYGwasanaethIechydGwladolInput",
    render: (args) => h("lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rhif y Gwasanaeth Iechyd Gwladol"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
