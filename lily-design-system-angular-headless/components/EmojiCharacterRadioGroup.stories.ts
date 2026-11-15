import type { Meta, StoryObj } from "@storybook/angular";
import { EmojiCharacterRadioGroup } from "./EmojiCharacterRadioGroup";

const meta: Meta<EmojiCharacterRadioGroup> = {
    title: "Headless/EmojiCharacterRadioGroup",
    component: EmojiCharacterRadioGroup,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EmojiCharacterRadioGroup>;

export const Default: Story = {};
