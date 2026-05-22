import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="float-button"
  type="button"
  data-position="bottom-right"
  style="position: fixed; bottom: 1rem; right: 1rem;"></button>`;

const meta = {
  title: 'Headless/FloatButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
