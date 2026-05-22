import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="panel">  <div class="panel-body"></div>
</div>`;

const meta = {
  title: 'Headless/Panel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
