import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div class="show-more"><div class="show-more-content" id="sm" data-expanded="false">Long content</div><button type="button" class="show-more-button" data-module="show-more" aria-expanded="false" aria-controls="sm">Show more</button></div>`;

const meta = {
  title: 'Headless/ShowMore',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
