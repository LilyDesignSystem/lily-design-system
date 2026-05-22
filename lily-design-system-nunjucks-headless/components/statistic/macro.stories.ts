import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="statistic"
  role="group"
  aria-label="undefined: undefined">
  <div class="statistic-title"></div>
  <div class="statistic-value"></div>
</div>`;

const meta = {
  title: 'Headless/Statistic',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
