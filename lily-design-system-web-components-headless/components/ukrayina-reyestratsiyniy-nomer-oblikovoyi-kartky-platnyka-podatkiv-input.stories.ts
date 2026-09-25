import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput",
    render: (args) => h("lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Реєстраційний номер облікової картки платника податків (РНОКПП)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
