import type { Meta, StoryObj } from "@storybook/angular";
import { MockupPhoneLandscape } from "./MockupPhoneLandscape";

const meta: Meta<MockupPhoneLandscape> = {
  title: "Headless/MockupPhoneLandscape",
  component: MockupPhoneLandscape,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupPhoneLandscape>;

export const Default: Story = {};
