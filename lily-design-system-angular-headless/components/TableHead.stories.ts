import type { Meta, StoryObj } from "@storybook/angular";
import { TableHead } from "./TableHead";

const meta: Meta<TableHead> = {
  title: "Headless/TableHead",
  component: TableHead,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TableHead>;

export const Default: Story = {};
