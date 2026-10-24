import type { Meta, StoryObj } from "@storybook/angular";
import { ConvertIntoValueDiv } from "./ConvertIntoValueDiv";

const meta: Meta<ConvertIntoValueDiv> = {
  title: "Headless/ConvertIntoValueDiv",
  component: ConvertIntoValueDiv,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ConvertIntoValueDiv>;

export const Default: Story = {};
