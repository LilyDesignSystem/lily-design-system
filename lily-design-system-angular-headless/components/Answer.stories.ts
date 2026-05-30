import type { Meta, StoryObj } from "@storybook/angular";
import { Answer } from "./Answer";

const meta: Meta<Answer> = {
  title: "Headless/Answer",
  component: Answer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Answer>;

export const Default: Story = {};
