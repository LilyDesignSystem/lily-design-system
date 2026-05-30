import type { Meta, StoryObj } from "@storybook/angular";
import { TableTD } from "./TableTD";

const meta: Meta<TableTD> = {
  title: "Headless/TableTD",
  component: TableTD,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TableTD>;

export const Default: Story = {};
