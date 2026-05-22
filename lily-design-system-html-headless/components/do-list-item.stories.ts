import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="do-list-item"
>
  <!-- Consumer provides item content -->
</li>`;

const meta = {
  title: 'Headless/DoListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
