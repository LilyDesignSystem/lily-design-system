import type { Meta, StoryObj } from "@storybook/angular";
import { TableTH } from "./TableTH";

const meta: Meta<TableTH> = {
  title: "Headless/TableTH",
  component: TableTH,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TableTH>;

export const Default: Story = {};
