import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ghana-card-personal-identification-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/GhanaCardPersonalIdentificationNumberView",
    render: (args) =>
        h(
            "lily-ghana-card-personal-identification-number-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Ghana Card PIN",
        value: "GHA-123456789-1",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
