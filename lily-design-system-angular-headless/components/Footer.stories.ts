import type { Meta, StoryObj } from "@storybook/angular";
import { Footer } from "./Footer";

const meta: Meta<Footer> = {
  title: "Headless/Footer",
  component: Footer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Footer>;

export const Default: Story = {};
