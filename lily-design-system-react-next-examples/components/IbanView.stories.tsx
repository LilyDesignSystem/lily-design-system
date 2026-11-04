import type { Meta, StoryObj } from "@storybook/react-vite";
import IbanView from "./IbanView";

const meta = {
    title: "Headless/IbanView",
    component: IbanView,
    tags: ["autodocs"],
} satisfies Meta<typeof IbanView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "IbanView" },
};
