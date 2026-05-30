import type { Meta, StoryObj } from "@storybook/angular";
import { EspanaTarjetaSanitariaIndividualView } from "./EspanaTarjetaSanitariaIndividualView";

const meta: Meta<EspanaTarjetaSanitariaIndividualView> = {
  title: "Headless/EspanaTarjetaSanitariaIndividualView",
  component: EspanaTarjetaSanitariaIndividualView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EspanaTarjetaSanitariaIndividualView>;

export const Default: Story = {};
