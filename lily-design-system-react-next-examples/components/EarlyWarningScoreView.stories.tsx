import type { Meta, StoryObj } from "@storybook/react-vite";
import EarlyWarningScoreView from "./EarlyWarningScoreView";

const meta = {
    title: "Headless/EarlyWarningScoreView",
    component: EarlyWarningScoreView,
    tags: ["autodocs"],
} satisfies Meta<typeof EarlyWarningScoreView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        system: "NEWS2",
        score: 7,
        band: "high",
        bandLabel: "High",
        escalation: "Urgent response",
    },
};
