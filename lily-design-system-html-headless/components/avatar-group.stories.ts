import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="avatar-group"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/AvatarGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
