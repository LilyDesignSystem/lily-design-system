import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<select
  class="select"
  id=""
  name=""></select>`;

const meta = {
  title: 'Headless/Select',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
