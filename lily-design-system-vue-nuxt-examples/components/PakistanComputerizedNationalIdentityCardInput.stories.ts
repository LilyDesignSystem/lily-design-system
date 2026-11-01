import type { Meta, StoryObj } from "@storybook/vue3-vite";
import PakistanComputerizedNationalIdentityCardInput from "./PakistanComputerizedNationalIdentityCardInput.vue";

const meta = {
    title: "Headless/PakistanComputerizedNationalIdentityCardInput",
    component: PakistanComputerizedNationalIdentityCardInput,
    tags: ["autodocs"],
} satisfies Meta<typeof PakistanComputerizedNationalIdentityCardInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "PakistanComputerizedNationalIdentityCardInput" },
};
