import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput",
    render: (args) =>
        h(
            "lily-ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Personal identification number (JShShIR / PINFL)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
