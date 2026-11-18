import type { Meta, StoryObj } from "@storybook/react-vite";
import SriLankaNationalIdentityCardInput from "./SriLankaNationalIdentityCardInput";

const meta = {
    title: "Headless/SriLankaNationalIdentityCardInput",
    component: SriLankaNationalIdentityCardInput,
    tags: ["autodocs"],
} satisfies Meta<typeof SriLankaNationalIdentityCardInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "SriLankaNationalIdentityCardInput" },
};
