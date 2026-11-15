import type { Meta, StoryObj } from "@storybook/react-vite";
import NetPromoterScoreRadioInput from "./NetPromoterScoreRadioInput";

const meta = {
    title: "Headless/NetPromoterScoreRadioInput",
    component: NetPromoterScoreRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof NetPromoterScoreRadioInput>;

export default meta;
type Story = StoryObj<typeof NetPromoterScoreRadioInput>;

export const Default: Story = {};
