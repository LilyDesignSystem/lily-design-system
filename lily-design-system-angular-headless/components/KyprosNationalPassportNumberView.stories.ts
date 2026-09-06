import type { Meta, StoryObj } from "@storybook/angular";
import { KyprosNationalPassportNumberView } from "./KyprosNationalPassportNumberView";

const meta: Meta<KyprosNationalPassportNumberView> = {
  title: "Headless/KyprosNationalPassportNumberView",
  component: KyprosNationalPassportNumberView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KyprosNationalPassportNumberView>;

export const Default: Story = {};
