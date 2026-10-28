import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<picture class="picture">
  <source srcset="wide.webp" media="(min-width: 800px)" type="image/webp">
  <img src="small.jpg" alt="A lily in bloom" width="320" height="200">
</picture>`;

const meta = {
  title: 'Headless/Picture',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
