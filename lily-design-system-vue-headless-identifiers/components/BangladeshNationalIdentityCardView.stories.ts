import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BangladeshNationalIdentityCardView from "./BangladeshNationalIdentityCardView.vue";

const meta = {
    title: "Headless/BangladeshNationalIdentityCardView",
    component: BangladeshNationalIdentityCardView,
    tags: ["autodocs"],
} satisfies Meta<typeof BangladeshNationalIdentityCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "BangladeshNationalIdentityCardView" },
};
