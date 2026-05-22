import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="check-list-item"
>
  <!-- Consumer provides item content -->
</li>`;

const meta = {
  title: 'Headless/CheckListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
