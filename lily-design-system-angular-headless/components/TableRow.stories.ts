import type { Meta, StoryObj } from "@storybook/angular";
import { TableRow } from "./TableRow";

const meta: Meta<TableRow> = {
  title: "Headless/TableRow",
  component: TableRow,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TableRow>;

export const Default: Story = {};
