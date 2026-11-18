import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./guatemala-codigo-unico-de-identificacion-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/GuatemalaCodigoUnicoDeIdentificacionView",
    render: (args) =>
        h(
            "lily-guatemala-codigo-unico-de-identificacion-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Código Único de Identificación (CUI)",
        value: "1234 56789 0101",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
