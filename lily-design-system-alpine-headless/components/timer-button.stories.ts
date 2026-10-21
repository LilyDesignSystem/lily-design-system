import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button\n  class=\"timer-button\"\n  aria-label=\"\"\n  type=\"button\"\n  data-remaining-seconds=\"\"\n>\n  <!-- Consumer provides content -->\n</button>";

const meta = {
  title: 'Headless/Timer Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
