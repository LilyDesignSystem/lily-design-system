import type { Meta, StoryObj } from "@storybook/angular";
import { PinInputDiv } from "./PinInputDiv";

const meta: Meta<PinInputDiv> = {
  title: "Headless/PinInputDiv",
  component: PinInputDiv,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PinInputDiv>;

export const Default: Story = {};
