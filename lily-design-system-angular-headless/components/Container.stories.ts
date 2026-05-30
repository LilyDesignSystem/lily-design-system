import type { Meta, StoryObj } from "@storybook/angular";
import { Container } from "./Container";

const meta: Meta<Container> = {
  title: "Headless/Container",
  component: Container,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Container>;

export const Default: Story = {};
