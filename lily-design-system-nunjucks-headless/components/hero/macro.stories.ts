import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<section
  class="hero">
  <div class="hero-inner">  </div>
</section>`;

const meta = {
  title: 'Headless/Hero',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
