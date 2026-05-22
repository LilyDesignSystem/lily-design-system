import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="action-link"
  href="#"></a>`;

const meta = {
  title: 'Headless/ActionLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
