import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="hero-headline"
  aria-label=""><div class="hero-headline-content"></div>
</div>`;

const meta = {
  title: 'Headless/HeroHeadline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
