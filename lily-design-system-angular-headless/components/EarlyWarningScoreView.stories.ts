import type { Meta, StoryObj } from "@storybook/angular";
import { EarlyWarningScoreView } from "./EarlyWarningScoreView";

const meta: Meta<EarlyWarningScoreView> = {
    title: "Headless/EarlyWarningScoreView",
    component: EarlyWarningScoreView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EarlyWarningScoreView>;

export const Default: Story = {
    args: {
        system: "NEWS2",
        score: 7,
        band: "high",
        bandLabel: "High",
        escalation: "Urgent response",
    },
};
