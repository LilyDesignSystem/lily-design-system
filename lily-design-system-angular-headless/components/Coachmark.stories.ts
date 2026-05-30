import type { Meta, StoryObj } from "@storybook/angular";
import { Coachmark } from "./Coachmark";

const meta: Meta<Coachmark> = {
  title: "Headless/Coachmark",
  component: Coachmark,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Coachmark>;

export const Default: Story = {};
