import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<header
  class="header"
  aria-label=""
>
  <!-- Consumer provides content -->
</header>`;

const meta = {
  title: 'Headless/Header',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
