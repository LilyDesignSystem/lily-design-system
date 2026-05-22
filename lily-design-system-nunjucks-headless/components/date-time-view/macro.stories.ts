import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<time
  class="date-time-view"></time>`;

const meta = {
  title: 'Headless/DateTimeView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
