import type { Meta, StoryObj } from "@storybook/angular";
import { MaltaPassportNumberView } from "./MaltaPassportNumberView";

const meta: Meta<MaltaPassportNumberView> = {
  title: "Headless/MaltaPassportNumberView",
  component: MaltaPassportNumberView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MaltaPassportNumberView>;

export const Default: Story = {};
