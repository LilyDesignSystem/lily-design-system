import type { Meta, StoryObj } from "@storybook/angular";
import { DigitalObjectIdentifierLink } from "./DigitalObjectIdentifierLink";

const meta: Meta<DigitalObjectIdentifierLink> = {
  title: "Headless/DigitalObjectIdentifierLink",
  component: DigitalObjectIdentifierLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DigitalObjectIdentifierLink>;

export const Default: Story = {};
