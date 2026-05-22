import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="watermark"
  data-rotate="-22"
  data-gap="100px">
  <div
    class="watermark-overlay"
    aria-hidden="true"  ></div></div>`;

const meta = {
  title: 'Headless/Watermark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
