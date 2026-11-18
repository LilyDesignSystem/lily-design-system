import type { Meta, StoryObj } from "@storybook/react-vite";
import AlImaratRaqmAlHuwiyahInput from "./AlImaratRaqmAlHuwiyahInput";

const meta = {
    title: "Headless/AlImaratRaqmAlHuwiyahInput",
    component: AlImaratRaqmAlHuwiyahInput,
    tags: ["autodocs"],
} satisfies Meta<typeof AlImaratRaqmAlHuwiyahInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AlImaratRaqmAlHuwiyahInput" },
};
