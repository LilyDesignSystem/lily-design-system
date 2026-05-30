import type { Meta, StoryObj } from "@storybook/angular";
import { Question } from "./Question";

const meta: Meta<Question> = {
  title: "Headless/Question",
  component: Question,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Question>;

export const Default: Story = {};
