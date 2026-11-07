import type { Meta, StoryObj } from "@storybook/angular";
import { RedAmberGreenPicker } from "./RedAmberGreenPicker";

const LABELS = { red: "Off track", amber: "At risk", green: "On track" };

const meta: Meta<RedAmberGreenPicker> = {
    title: "Headless/RedAmberGreenPicker",
    component: RedAmberGreenPicker,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RedAmberGreenPicker>;

export const Default: Story = {
    args: {
        label: "Project status",
        statusLabel: (status: string) => (LABELS as Record<string, string>)[status],
    },
};
