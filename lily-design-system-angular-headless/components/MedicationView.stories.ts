import type { Meta, StoryObj } from "@storybook/angular";
import { MedicationView } from "./MedicationView";

const meta: Meta<MedicationView> = {
    title: "Headless/MedicationView",
    component: MedicationView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MedicationView>;

export const Default: Story = {
    args: {
        nameSegments: [{ text: "hydr" }, { text: "ALAZINE", tallMan: true }],
        strength: "25 mg",
        form: "tablet",
        route: "oral",
        frequency: "twice daily",
    },
};
