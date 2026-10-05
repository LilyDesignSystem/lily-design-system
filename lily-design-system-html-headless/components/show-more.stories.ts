import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="show-more"
  data-more-label="Show more"
  data-less-label="Show less"
>
  <div class="show-more-content" id="show-more-content-1" data-expanded="false">
    <p>Long content goes here. Consumer CSS clamps it while data-expanded is false.</p>
  </div>
  <button
    type="button"
    class="show-more-button"
    aria-expanded="false"
    aria-controls="show-more-content-1"
  >Show more</button>
</div>`;

const meta = {
  title: 'Headless/ShowMore',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
