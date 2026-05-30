import type { Meta, StoryObj } from "@storybook/angular";
import { UrlInput } from "./UrlInput";

const meta: Meta<UrlInput> = {
  title: "Headless/UrlInput",
  component: UrlInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<UrlInput>;

export const Default: Story = {};
