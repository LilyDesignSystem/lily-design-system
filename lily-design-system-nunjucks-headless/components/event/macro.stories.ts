import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="event"></article>`;

const meta = {
  title: 'Headless/Event',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
