import type { Meta, StoryObj } from "@storybook/angular";
import { RomaniaCodNumericPersonalView } from "./RomaniaCodNumericPersonalView";

const meta: Meta<RomaniaCodNumericPersonalView> = {
  title: "Headless/RomaniaCodNumericPersonalView",
  component: RomaniaCodNumericPersonalView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RomaniaCodNumericPersonalView>;

export const Default: Story = {};
