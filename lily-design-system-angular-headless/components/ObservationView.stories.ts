import type { Meta, StoryObj } from "@storybook/angular";
import { ObservationView } from "./ObservationView";

const meta: Meta<ObservationView> = {
    title: "Headless/ObservationView",
    component: ObservationView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ObservationView>;

export const Default: Story = {
    args: {
        label: "Potassium",
        value: "5.9",
        unit: "mmol/L",
        interpretation: "H",
        flagLabel: "High",
        range: "3.5–5.3",
    },
};
