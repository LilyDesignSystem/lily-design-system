import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"mockup-watch\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Watch',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
