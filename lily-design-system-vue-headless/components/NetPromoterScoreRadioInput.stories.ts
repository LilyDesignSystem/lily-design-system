import type { Meta, StoryObj } from "@storybook/vue3-vite";
import NetPromoterScoreRadioInput from "./NetPromoterScoreRadioInput.vue";

const meta = {
    title: "Headless/NetPromoterScoreRadioInput",
    component: NetPromoterScoreRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof NetPromoterScoreRadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
