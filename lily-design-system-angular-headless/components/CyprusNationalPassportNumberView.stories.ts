import type { Meta, StoryObj } from "@storybook/angular";
import { CyprusNationalPassportNumberView } from "./CyprusNationalPassportNumberView";

const meta: Meta<CyprusNationalPassportNumberView> = {
  title: "Headless/CyprusNationalPassportNumberView",
  component: CyprusNationalPassportNumberView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CyprusNationalPassportNumberView>;

export const Default: Story = {};
