import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="timer-button"
  type="button"
  data-module="timer-button"
  data-duration=""><span class="timer-button-text"></span> <span class="timer-button-countdown" aria-hidden="true"></span></button>`;

const meta = {
  title: 'Headless/TimerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
