import type { Meta, StoryObj } from "@storybook/angular";
import { InformationCallout } from "./InformationCallout";

const meta: Meta<InformationCallout> = {
  title: "Headless/InformationCallout",
  component: InformationCallout,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<InformationCallout>;

export const Default: Story = {};
