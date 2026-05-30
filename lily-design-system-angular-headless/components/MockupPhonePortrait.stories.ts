import type { Meta, StoryObj } from "@storybook/angular";
import { MockupPhonePortrait } from "./MockupPhonePortrait";

const meta: Meta<MockupPhonePortrait> = {
  title: "Headless/MockupPhonePortrait",
  component: MockupPhonePortrait,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupPhonePortrait>;

export const Default: Story = {};
