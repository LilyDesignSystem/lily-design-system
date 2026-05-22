import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="input-with-mask"
  data-mask="">
  <span class="input-with-mask-display" aria-hidden="true"></span>
  <input
    class="input-with-mask-control"
    type="text"    value=""  >
</div>`;

const meta = {
  title: 'Headless/InputWithMask',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
