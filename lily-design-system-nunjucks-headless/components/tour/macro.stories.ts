import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<section
  class="tour" aria-label="Tour"></section>`;

const meta = {
  title: 'Headless/Tour',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
