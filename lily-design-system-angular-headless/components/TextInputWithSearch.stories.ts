import type { Meta, StoryObj } from "@storybook/angular";
import { TextInputWithSearch } from "./TextInputWithSearch";

const meta: Meta<TextInputWithSearch> = {
  title: "Headless/TextInputWithSearch",
  component: TextInputWithSearch,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TextInputWithSearch>;

export const Default: Story = {};
