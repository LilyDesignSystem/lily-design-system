import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<figure\n  class="video-player"\n  aria-label=""\n>\n  <video\n    class="video-player-element"\n    src=""\n    controls\n    playsinline\n  ></video>\n  <figcaption class="video-player-caption">\n    <!-- Consumer provides caption -->\n  </figcaption>\n</figure>';

const meta = {
    title: "Headless/Video Player",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
