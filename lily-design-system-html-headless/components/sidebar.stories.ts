import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="sidebar"
  role="complementary"
  aria-label=""
>
  <!-- Consumer provides content -->
</aside>`;

const meta = {
  title: 'Headless/Sidebar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
