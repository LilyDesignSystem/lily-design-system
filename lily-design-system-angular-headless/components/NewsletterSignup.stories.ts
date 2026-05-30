import type { Meta, StoryObj } from "@storybook/angular";
import { NewsletterSignup } from "./NewsletterSignup";

const meta: Meta<NewsletterSignup> = {
  title: "Headless/NewsletterSignup",
  component: NewsletterSignup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NewsletterSignup>;

export const Default: Story = {};
