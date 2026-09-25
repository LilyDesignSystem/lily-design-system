import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./indonesia-nomor-induk-kependudukan-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/IndonesiaNomorIndukKependudukanView",
    render: (args) => h("lily-indonesia-nomor-induk-kependudukan-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Nomor Induk Kependudukan (NIK)",
        "value": "3171012501990001"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
