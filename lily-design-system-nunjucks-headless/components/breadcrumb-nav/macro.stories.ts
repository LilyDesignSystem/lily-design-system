import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="breadcrumb-nav" aria-label="Breadcrumb"></nav>`;

const meta = {
  title: 'Headless/BreadcrumbNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
