import type { Meta, StoryObj } from "@storybook/angular";
import { RedOrangeYellowGreenBluePicker } from "./RedOrangeYellowGreenBluePicker";

const LABELS = {
    red: "Severe",
    orange: "High",
    yellow: "Medium",
    green: "Low",
    blue: "Informational",
};

const meta: Meta<RedOrangeYellowGreenBluePicker> = {
    title: "Headless/RedOrangeYellowGreenBluePicker",
    component: RedOrangeYellowGreenBluePicker,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RedOrangeYellowGreenBluePicker>;

export const Default: Story = {
    args: {
        label: "Risk level",
        statusLabel: (status: string) => (LABELS as Record<string, string>)[status],
    },
};
