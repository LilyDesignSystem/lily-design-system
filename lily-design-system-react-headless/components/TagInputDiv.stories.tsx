import type { Meta, StoryObj } from "@storybook/react-vite";
import TagInputDiv from "./TagInputDiv";

const meta = {
    title: "Headless/TagInputDiv",
    component: TagInputDiv,
    tags: ["autodocs"],
} satisfies Meta<typeof TagInputDiv>;

export default meta;
type Story = StoryObj<typeof TagInputDiv>;

export const Default: Story = {};
