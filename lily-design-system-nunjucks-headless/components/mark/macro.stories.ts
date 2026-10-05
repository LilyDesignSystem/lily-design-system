import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<mark class="mark">search_web</mark></div>`;

const meta = {
  title: 'Headless/Mark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
