import type { Meta, StoryObj } from "@storybook/angular";
import { AddressographBox } from "./AddressographBox";

const meta: Meta<AddressographBox> = {
  title: "Headless/AddressographBox",
  component: AddressographBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AddressographBox>;

export const Default: Story = {};
