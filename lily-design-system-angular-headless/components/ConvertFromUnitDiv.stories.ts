import type { Meta, StoryObj } from "@storybook/angular";
import { ConvertFromUnitDiv } from "./ConvertFromUnitDiv";

const meta: Meta<ConvertFromUnitDiv> = {
  title: "Headless/ConvertFromUnitDiv",
  component: ConvertFromUnitDiv,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ConvertFromUnitDiv>;

export const Default: Story = {};
