import type { Meta, StoryObj } from "@storybook/angular";
import { SplitView } from "./SplitView";

const meta: Meta<SplitView> = {
    title: "Headless/SplitView",
    component: SplitView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SplitView>;

export const Default: Story = {
    render: () => ({
        moduleMetadata: { imports: [SplitView] },
        template: `<lily-split-view label="Editor and preview" [splitPercent]="40"><div primary>Editor</div><div secondary>Preview</div></lily-split-view>`,
    }),
};
