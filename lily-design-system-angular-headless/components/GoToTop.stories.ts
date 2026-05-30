import type { Meta, StoryObj } from "@storybook/angular";
import { GoToTop } from "./GoToTop";

const meta: Meta<GoToTop> = {
  title: "Headless/GoToTop",
  component: GoToTop,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GoToTop>;

export const Default: Story = {};
