import type { Meta, StoryObj } from "@storybook/react-vite";
import NetPromoterScoreRadioGroup from "./NetPromoterScoreRadioGroup";

const meta = {
    title: "Headless/NetPromoterScoreRadioGroup",
    component: NetPromoterScoreRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof NetPromoterScoreRadioGroup>;

export default meta;
type Story = StoryObj<typeof NetPromoterScoreRadioGroup>;

export const Default: Story = {};
