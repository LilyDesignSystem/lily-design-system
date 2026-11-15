import type { Meta, StoryObj } from "@storybook/vue3-vite";
import NetPromoterScoreRadioGroup from "./NetPromoterScoreRadioGroup.vue";

const meta = {
    title: "Headless/NetPromoterScoreRadioGroup",
    component: NetPromoterScoreRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof NetPromoterScoreRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
