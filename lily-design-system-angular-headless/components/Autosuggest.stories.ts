import type { Meta, StoryObj } from "@storybook/angular";
import { Autosuggest } from "./Autosuggest";

const meta: Meta<Autosuggest> = {
  title: "Headless/Autosuggest",
  component: Autosuggest,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Autosuggest>;

export const Default: Story = {};
