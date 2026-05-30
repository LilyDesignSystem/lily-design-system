import type { Meta, StoryObj } from "@storybook/angular";
import { SuomiHenkilotunnusView } from "./SuomiHenkilotunnusView";

const meta: Meta<SuomiHenkilotunnusView> = {
  title: "Headless/SuomiHenkilotunnusView",
  component: SuomiHenkilotunnusView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SuomiHenkilotunnusView>;

export const Default: Story = {};
