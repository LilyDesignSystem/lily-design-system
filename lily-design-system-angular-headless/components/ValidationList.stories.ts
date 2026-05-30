import type { Meta, StoryObj } from "@storybook/angular";
import { ValidationList } from "./ValidationList";

const meta: Meta<ValidationList> = {
  title: "Headless/ValidationList",
  component: ValidationList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ValidationList>;

export const Default: Story = {};
