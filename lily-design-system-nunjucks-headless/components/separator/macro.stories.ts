import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<hr
  class="separator"
  data-orientation="horizontal">`;

const meta = {
  title: 'Headless/Separator',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
