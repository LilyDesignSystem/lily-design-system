import type { Meta, StoryObj } from "@storybook/angular";
import { TableFoot } from "./TableFoot";

const meta: Meta<TableFoot> = {
  title: "Headless/TableFoot",
  component: TableFoot,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TableFoot>;

export const Default: Story = {};
