import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./indonesia-nomor-induk-kependudukan-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/IndonesiaNomorIndukKependudukanInput",
    render: (args) => h("lily-indonesia-nomor-induk-kependudukan-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Nomor Induk Kependudukan (NIK)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
