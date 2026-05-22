import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="contents-nav" aria-label="Contents"></nav>`;

const meta = {
  title: 'Headless/ContentsNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
