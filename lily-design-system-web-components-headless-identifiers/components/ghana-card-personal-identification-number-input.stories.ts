import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ghana-card-personal-identification-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/GhanaCardPersonalIdentificationNumberInput",
    render: (args) =>
        h(
            "lily-ghana-card-personal-identification-number-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Ghana Card PIN",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
