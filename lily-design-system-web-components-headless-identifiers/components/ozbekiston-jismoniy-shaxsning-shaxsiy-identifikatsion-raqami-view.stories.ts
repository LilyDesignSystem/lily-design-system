import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView",
    render: (args) =>
        h(
            "lily-ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Personal identification number (JShShIR / PINFL)",
        value: "30101800050014",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
