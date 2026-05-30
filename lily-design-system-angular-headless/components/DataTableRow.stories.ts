import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableRow } from "./DataTableRow";

const meta: Meta<DataTableRow> = {
  title: "Headless/DataTableRow",
  component: DataTableRow,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DataTableRow>;

export const Default: Story = {};
