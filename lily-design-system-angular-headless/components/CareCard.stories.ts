import type { Meta, StoryObj } from "@storybook/angular";
import { CareCard } from "./CareCard";

const meta: Meta<CareCard> = {
  title: "Headless/CareCard",
  component: CareCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CareCard>;

export const Default: Story = {};
