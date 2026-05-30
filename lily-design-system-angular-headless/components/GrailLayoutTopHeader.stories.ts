import type { Meta, StoryObj } from "@storybook/angular";
import { GrailLayoutTopHeader } from "./GrailLayoutTopHeader";

const meta: Meta<GrailLayoutTopHeader> = {
  title: "Headless/GrailLayoutTopHeader",
  component: GrailLayoutTopHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GrailLayoutTopHeader>;

export const Default: Story = {};
