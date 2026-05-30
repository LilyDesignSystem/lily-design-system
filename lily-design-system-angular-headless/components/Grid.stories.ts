import type { Meta, StoryObj } from "@storybook/angular";
import { Grid } from "./Grid";

const meta: Meta<Grid> = {
  title: "Headless/Grid",
  component: Grid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Grid>;

export const Default: Story = {};
