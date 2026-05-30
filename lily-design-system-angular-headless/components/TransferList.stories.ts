import type { Meta, StoryObj } from "@storybook/angular";
import { TransferList } from "./TransferList";

const meta: Meta<TransferList> = {
  title: "Headless/TransferList",
  component: TransferList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TransferList>;

export const Default: Story = {};
