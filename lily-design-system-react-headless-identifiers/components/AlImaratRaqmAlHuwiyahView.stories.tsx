import type { Meta, StoryObj } from "@storybook/react-vite";
import AlImaratRaqmAlHuwiyahView from "./AlImaratRaqmAlHuwiyahView";

const meta = {
    title: "Headless/AlImaratRaqmAlHuwiyahView",
    component: AlImaratRaqmAlHuwiyahView,
    tags: ["autodocs"],
} satisfies Meta<typeof AlImaratRaqmAlHuwiyahView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AlImaratRaqmAlHuwiyahView" },
};
