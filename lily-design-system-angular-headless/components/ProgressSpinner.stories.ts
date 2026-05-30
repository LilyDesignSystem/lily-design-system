import type { Meta, StoryObj } from "@storybook/angular";
import { ProgressSpinner } from "./ProgressSpinner";

const meta: Meta<ProgressSpinner> = {
  title: "Headless/ProgressSpinner",
  component: ProgressSpinner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ProgressSpinner>;

export const Default: Story = {};
