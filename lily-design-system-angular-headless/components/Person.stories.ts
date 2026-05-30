import type { Meta, StoryObj } from "@storybook/angular";
import { Person } from "./Person";

const meta: Meta<Person> = {
  title: "Headless/Person",
  component: Person,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Person>;

export const Default: Story = {};
