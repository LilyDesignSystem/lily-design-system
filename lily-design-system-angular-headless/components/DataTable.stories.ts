import type { Meta, StoryObj } from "@storybook/angular";
import { DataTable } from "./DataTable";

const meta: Meta<DataTable> = {
  title: "Headless/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DataTable>;

export const Default: Story = {};
