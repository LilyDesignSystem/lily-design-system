import type { Meta, StoryObj } from "@storybook/angular";
import { ColombiaCedulaDeCiudadaniaView } from "./ColombiaCedulaDeCiudadaniaView";

const meta: Meta<ColombiaCedulaDeCiudadaniaView> = {
    title: "Headless/ColombiaCedulaDeCiudadaniaView",
    component: ColombiaCedulaDeCiudadaniaView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ColombiaCedulaDeCiudadaniaView>;

export const Default: Story = {};
