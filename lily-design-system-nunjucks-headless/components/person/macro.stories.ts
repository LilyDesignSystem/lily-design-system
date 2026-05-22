import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="person"
  role="group"
  aria-label=""></div>`;

const meta = {
  title: 'Headless/Person',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
