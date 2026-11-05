import type { Meta, StoryObj } from "@storybook/vue3-vite";
import TagInputDiv from "./TagInputDiv.vue";

const meta = {
    title: "Headless/TagInputDiv",
    component: TagInputDiv,
    tags: ["autodocs"],
} satisfies Meta<typeof TagInputDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
