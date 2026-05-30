import type { Meta, StoryObj } from "@storybook/angular";
import { VideoPlayer } from "./VideoPlayer";

const meta: Meta<VideoPlayer> = {
  title: "Headless/VideoPlayer",
  component: VideoPlayer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<VideoPlayer>;

export const Default: Story = {};
