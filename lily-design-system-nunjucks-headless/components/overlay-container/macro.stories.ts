import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="overlay-container"
  role="presentation"
  data-open="false"
  aria-hidden="true" hidden></div>`;

const meta = {
  title: 'Headless/OverlayContainer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
