import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="photo-pack" role="group"
  aria-label=""></div>`;

const meta = {
  title: 'Headless/PhotoPack',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
