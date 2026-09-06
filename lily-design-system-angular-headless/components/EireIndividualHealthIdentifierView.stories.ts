import type { Meta, StoryObj } from "@storybook/angular";
import { EireIndividualHealthIdentifierView } from "./EireIndividualHealthIdentifierView";

const meta: Meta<EireIndividualHealthIdentifierView> = {
  title: "Headless/EireIndividualHealthIdentifierView",
  component: EireIndividualHealthIdentifierView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EireIndividualHealthIdentifierView>;

export const Default: Story = {};
