import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView",
    render: (args) => h("lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Реєстраційний номер облікової картки платника податків (РНОКПП)",
        "value": "3061219210"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
