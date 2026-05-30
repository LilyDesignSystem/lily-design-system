import type { Meta, StoryObj } from "@storybook/angular";
import { Table } from "./Table";

const meta: Meta<Table> = {
  title: "Headless/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Table>;

export const Default: Story = {};
