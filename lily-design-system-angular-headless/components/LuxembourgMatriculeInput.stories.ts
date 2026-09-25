import type { Meta, StoryObj } from "@storybook/angular";
import { LuxembourgMatriculeInput } from "./LuxembourgMatriculeInput";

const meta: Meta<LuxembourgMatriculeInput> = {
  title: "Headless/LuxembourgMatriculeInput",
  component: LuxembourgMatriculeInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LuxembourgMatriculeInput>;

export const Default: Story = {};
