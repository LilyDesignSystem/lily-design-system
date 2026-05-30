import type { Meta, StoryObj } from "@storybook/angular";
import { MockupLaptop } from "./MockupLaptop";

const meta: Meta<MockupLaptop> = {
  title: "Headless/MockupLaptop",
  component: MockupLaptop,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupLaptop>;

export const Default: Story = {};
