import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./qazaqstan-zheke-saikestendiru-nomiri-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/QazaqstanZhekeSaikestendiruNomiriInput",
    render: (args) =>
        h(
            "lily-qazaqstan-zheke-saikestendiru-nomiri-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Individual Identification Number (IIN)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
