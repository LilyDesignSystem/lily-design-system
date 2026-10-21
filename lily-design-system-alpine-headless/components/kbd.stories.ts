import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<kbd\n  class=\"kbd\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</kbd>";

const meta = {
  title: 'Headless/Kbd',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
