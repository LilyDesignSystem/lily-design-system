import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<address
  class="place"></address>`;

const meta = {
  title: 'Headless/Place',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
