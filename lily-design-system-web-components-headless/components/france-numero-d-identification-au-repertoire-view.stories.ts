import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./france-numero-d-identification-au-repertoire-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/FranceNumeroDIdentificationAuRepertoireView",
    render: (args) => h("lily-france-numero-d-identification-au-repertoire-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Numéro d'Identification au Répertoire",
        "value": "1 85 05 75 116 001 23"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
