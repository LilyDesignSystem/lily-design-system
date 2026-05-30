import type { Meta, StoryObj } from "@storybook/angular";
import { DataFilterForm } from "./DataFilterForm";

const meta: Meta<DataFilterForm> = {
  title: "Headless/DataFilterForm",
  component: DataFilterForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DataFilterForm>;

export const Default: Story = {};
