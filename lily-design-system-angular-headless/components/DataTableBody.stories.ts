import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableBody } from "./DataTableBody";

const meta: Meta<DataTableBody> = {
  title: "Headless/DataTableBody",
  component: DataTableBody,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DataTableBody>;

export const Default: Story = {};
