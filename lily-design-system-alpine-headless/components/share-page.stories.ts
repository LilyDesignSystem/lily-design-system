import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SharePage component -->\n<div\n  class=\"share-page\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Share Page',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
