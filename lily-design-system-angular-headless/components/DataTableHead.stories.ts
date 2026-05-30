import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableHead } from "./DataTableHead";

const meta: Meta<DataTableHead> = {
  title: "Headless/DataTableHead",
  component: DataTableHead,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DataTableHead>;

export const Default: Story = {};
