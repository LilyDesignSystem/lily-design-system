import type { Meta, StoryObj } from "@storybook/angular";
import { ProductCard } from "./ProductCard";

const meta: Meta<ProductCard> = {
  title: "Headless/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ProductCard>;

export const Default: Story = {};
