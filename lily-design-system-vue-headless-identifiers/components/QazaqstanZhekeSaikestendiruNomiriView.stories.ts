import type { Meta, StoryObj } from "@storybook/vue3-vite";
import QazaqstanZhekeSaikestendiruNomiriView from "./QazaqstanZhekeSaikestendiruNomiriView.vue";

const meta = {
    title: "Headless/QazaqstanZhekeSaikestendiruNomiriView",
    component: QazaqstanZhekeSaikestendiruNomiriView,
    tags: ["autodocs"],
} satisfies Meta<typeof QazaqstanZhekeSaikestendiruNomiriView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "QazaqstanZhekeSaikestendiruNomiriView" },
};
