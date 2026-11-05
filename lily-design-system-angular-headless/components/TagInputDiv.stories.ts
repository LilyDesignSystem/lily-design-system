import type { Meta, StoryObj } from "@storybook/angular";
import { TagInputDiv } from "./TagInputDiv";

const meta: Meta<TagInputDiv> = {
    title: "Headless/TagInputDiv",
    component: TagInputDiv,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TagInputDiv>;

export const Default: Story = {};
