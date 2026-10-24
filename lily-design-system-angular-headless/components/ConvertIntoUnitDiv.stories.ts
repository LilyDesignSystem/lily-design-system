import type { Meta, StoryObj } from "@storybook/angular";
import { ConvertIntoUnitDiv } from "./ConvertIntoUnitDiv";

const meta: Meta<ConvertIntoUnitDiv> = {
  title: "Headless/ConvertIntoUnitDiv",
  component: ConvertIntoUnitDiv,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ConvertIntoUnitDiv>;

export const Default: Story = {};
