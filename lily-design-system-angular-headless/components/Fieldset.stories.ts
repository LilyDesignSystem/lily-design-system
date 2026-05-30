import type { Meta, StoryObj } from "@storybook/angular";
import { Fieldset } from "./Fieldset";

const meta: Meta<Fieldset> = {
  title: "Headless/Fieldset",
  component: Fieldset,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Fieldset>;

export const Default: Story = {};
