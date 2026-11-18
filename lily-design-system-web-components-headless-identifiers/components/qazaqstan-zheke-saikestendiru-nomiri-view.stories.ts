import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./qazaqstan-zheke-saikestendiru-nomiri-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/QazaqstanZhekeSaikestendiruNomiriView",
    render: (args) =>
        h(
            "lily-qazaqstan-zheke-saikestendiru-nomiri-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Individual Identification Number (IIN)",
        value: "900101300123",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
