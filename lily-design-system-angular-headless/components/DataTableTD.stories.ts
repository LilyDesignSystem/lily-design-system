import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableTD } from "./DataTableTD";

const meta: Meta<DataTableTD> = {
  title: "Headless/DataTableTD",
  component: DataTableTD,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DataTableTD>;

export const Default: Story = {};
