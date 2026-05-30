import type { Meta, StoryObj } from "@storybook/angular";
import { TableBody } from "./TableBody";

const meta: Meta<TableBody> = {
  title: "Headless/TableBody",
  component: TableBody,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TableBody>;

export const Default: Story = {};
