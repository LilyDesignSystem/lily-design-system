import type { Meta, StoryObj } from "@storybook/react-vite";
import PakistanComputerizedNationalIdentityCardView from "./PakistanComputerizedNationalIdentityCardView";

const meta = {
    title: "Headless/PakistanComputerizedNationalIdentityCardView",
    component: PakistanComputerizedNationalIdentityCardView,
    tags: ["autodocs"],
} satisfies Meta<typeof PakistanComputerizedNationalIdentityCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "PakistanComputerizedNationalIdentityCardView" },
};
