import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="slider-button"
  role="slider"
  aria-label=""
  type="button"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="0"
>
  <!-- Consumer provides content -->
</button>`;

const meta = {
  title: 'Headless/SliderButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
