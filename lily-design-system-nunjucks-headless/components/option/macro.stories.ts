import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<option class="option"></option>`;

const meta = {
  title: 'Headless/Option',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
