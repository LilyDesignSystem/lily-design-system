import type { Meta, StoryObj } from "@storybook/vue3-vite";
import QazaqstanZhekeSaikestendiruNomiriInput from "./QazaqstanZhekeSaikestendiruNomiriInput.vue";

const meta = {
    title: "Headless/QazaqstanZhekeSaikestendiruNomiriInput",
    component: QazaqstanZhekeSaikestendiruNomiriInput,
    tags: ["autodocs"],
} satisfies Meta<typeof QazaqstanZhekeSaikestendiruNomiriInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "QazaqstanZhekeSaikestendiruNomiriInput" },
};
