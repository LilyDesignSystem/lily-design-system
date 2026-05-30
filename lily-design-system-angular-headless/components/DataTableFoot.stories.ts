import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableFoot } from "./DataTableFoot";

const meta: Meta<DataTableFoot> = {
  title: "Headless/DataTableFoot",
  component: DataTableFoot,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DataTableFoot>;

export const Default: Story = {};
