import type { Meta, StoryObj } from "@storybook/react-vite";
import BangladeshNationalIdentityCardView from "./BangladeshNationalIdentityCardView";

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
