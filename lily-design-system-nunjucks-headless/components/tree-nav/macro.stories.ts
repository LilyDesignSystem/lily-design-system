import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="tree-nav" aria-label="Tree"></nav>`;

const meta = {
  title: 'Headless/TreeNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
