import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./peru-documento-nacional-de-identidad-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/PeruDocumentoNacionalDeIdentidadView",
    render: (args) =>
        h(
            "lily-peru-documento-nacional-de-identidad-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Documento Nacional de Identidad (DNI)",
        value: "10117410-2",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
