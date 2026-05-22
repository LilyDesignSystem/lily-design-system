import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="feature-photo">
  <img
    class="feature-photo-image"
    src=""
    alt=""
    loading="lazy"  ></figure>`;

const meta = {
  title: 'Headless/FeaturePhoto',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
