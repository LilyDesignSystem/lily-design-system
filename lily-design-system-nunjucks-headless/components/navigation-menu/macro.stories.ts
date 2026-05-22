import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="navigation-menu" aria-label="Site navigation"></nav>`;

const meta = {
  title: 'Headless/NavigationMenu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
