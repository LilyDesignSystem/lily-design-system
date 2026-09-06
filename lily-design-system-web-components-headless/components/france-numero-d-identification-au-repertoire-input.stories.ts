import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./france-numero-d-identification-au-repertoire-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/FranceNumeroDIdentificationAuRepertoireInput",
    render: (args) => h("lily-france-numero-d-identification-au-repertoire-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Numéro d'Identification au Répertoire"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
