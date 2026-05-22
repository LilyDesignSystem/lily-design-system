import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="breadcrumb-link"
  aria-label=""
  href=""
>
  <!-- Consumer provides content -->
</a>`;

const meta = {
  title: 'Headless/BreadcrumbLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
