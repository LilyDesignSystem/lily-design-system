import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./guatemala-codigo-unico-de-identificacion-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/GuatemalaCodigoUnicoDeIdentificacionInput",
    render: (args) =>
        h(
            "lily-guatemala-codigo-unico-de-identificacion-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Código Único de Identificación (CUI)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
