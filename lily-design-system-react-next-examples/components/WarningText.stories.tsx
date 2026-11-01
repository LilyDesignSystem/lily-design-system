import type { Meta, StoryObj } from "@storybook/react-vite";
import WarningText from "./WarningText";

const meta = {
    title: "Headless/WarningText",
    component: WarningText,
    tags: ["autodocs"],
    args: {
        icon: "!",
        children: "You can be fined up to £5,000 if you do not register.",
    },
} satisfies Meta<typeof WarningText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
