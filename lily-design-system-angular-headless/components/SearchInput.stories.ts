import type { Meta, StoryObj } from "@storybook/angular";
import { SearchInput } from "./SearchInput";

const meta: Meta<SearchInput> = {
  title: "Headless/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SearchInput>;

export const Default: Story = {};
