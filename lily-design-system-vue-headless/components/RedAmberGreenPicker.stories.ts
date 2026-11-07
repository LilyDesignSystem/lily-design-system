import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RedAmberGreenPicker from "./RedAmberGreenPicker.vue";

const LABELS = { red: "Off track", amber: "At risk", green: "On track" };

const meta = {
    title: "Headless/RedAmberGreenPicker",
    component: RedAmberGreenPicker,
    tags: ["autodocs"],
    args: {
        label: "Project status",
        statusLabel: (status: string) => (LABELS as Record<string, string>)[status],
    },
} satisfies Meta<typeof RedAmberGreenPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
