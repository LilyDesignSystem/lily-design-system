import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./peru-documento-nacional-de-identidad-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/PeruDocumentoNacionalDeIdentidadInput",
    render: (args) =>
        h(
            "lily-peru-documento-nacional-de-identidad-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Documento Nacional de Identidad (DNI)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
