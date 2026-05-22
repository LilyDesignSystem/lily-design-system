import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<dl
  class="description-list"
  aria-label=""
>
  <!-- Consumer provides content -->
</dl>`;

const meta = {
  title: 'Headless/DescriptionList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
