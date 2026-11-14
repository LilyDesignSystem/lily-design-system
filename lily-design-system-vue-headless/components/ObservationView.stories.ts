import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ObservationView from "./ObservationView.vue";

const meta = {
    title: "Headless/ObservationView",
    component: ObservationView,
    tags: ["autodocs"],
} satisfies Meta<typeof ObservationView>;

export default meta;
type Story = StoryObj<typeof meta>;

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
