import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="go-to-previous-section"
  href=""></a>`;

const meta = {
  title: 'Headless/GoToPreviousSection',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
