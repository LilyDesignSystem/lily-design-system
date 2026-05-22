import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<footer
  class="footer"></footer>`;

const meta = {
  title: 'Headless/Footer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
