import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RedOrangeYellowGreenBluePicker from "./RedOrangeYellowGreenBluePicker.vue";

const LABELS = {
    red: "Severe",
    orange: "High",
    yellow: "Medium",
    green: "Low",
    blue: "Informational",
};

const meta = {
    title: "Headless/RedOrangeYellowGreenBluePicker",
    component: RedOrangeYellowGreenBluePicker,
    tags: ["autodocs"],
    args: {
        label: "Risk level",
        statusLabel: (status: string) => (LABELS as Record<string, string>)[status],
    },
} satisfies Meta<typeof RedOrangeYellowGreenBluePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
