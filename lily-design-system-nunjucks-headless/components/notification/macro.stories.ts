import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="notification"
  role="status"
  data-variant="default">  <div class="notification-content"></div>
</div>`;

const meta = {
  title: 'Headless/Notification',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
