import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="slider-button"
  role="button"
  data-module="slider-button"
  data-confirmed-label="Confirmed"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="0"
  tabindex="0"  aria-label="Slide to confirm">
  <span class="slider-button-thumb" aria-hidden="true"></span>
  <span class="slider-button-track-label">Slide to confirm</span>
</div>`;

const meta = {
  title: 'Headless/SliderButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
