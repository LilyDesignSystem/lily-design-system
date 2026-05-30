import type { Meta, StoryObj } from "@storybook/angular";
import { CyprusNationalPassportNumberInput } from "./CyprusNationalPassportNumberInput";

const meta: Meta<CyprusNationalPassportNumberInput> = {
  title: "Headless/CyprusNationalPassportNumberInput",
  component: CyprusNationalPassportNumberInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CyprusNationalPassportNumberInput>;

export const Default: Story = {};
