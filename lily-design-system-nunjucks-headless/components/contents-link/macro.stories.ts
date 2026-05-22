import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="contents-link"
  href="#"></a>`;

const meta = {
  title: 'Headless/ContentsLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
