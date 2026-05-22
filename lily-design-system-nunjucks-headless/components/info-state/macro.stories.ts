import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<section
  class="info-state"
  role="status"
  data-level="info"
  aria-label=""></section>`;

const meta = {
  title: 'Headless/InfoState',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
