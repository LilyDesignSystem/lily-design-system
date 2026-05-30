import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableTH } from "./DataTableTH";

const meta: Meta<DataTableTH> = {
  title: "Headless/DataTableTH",
  component: DataTableTH,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DataTableTH>;

export const Default: Story = {};
