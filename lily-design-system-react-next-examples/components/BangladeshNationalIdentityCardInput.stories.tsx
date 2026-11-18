import type { Meta, StoryObj } from "@storybook/react-vite";
import BangladeshNationalIdentityCardInput from "./BangladeshNationalIdentityCardInput";

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
