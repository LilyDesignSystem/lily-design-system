import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BangladeshNationalIdentityCardInput from "./BangladeshNationalIdentityCardInput.vue";

const meta = {
    title: "Headless/BangladeshNationalIdentityCardInput",
    component: BangladeshNationalIdentityCardInput,
    tags: ["autodocs"],
} satisfies Meta<typeof BangladeshNationalIdentityCardInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "BangladeshNationalIdentityCardInput" },
};
