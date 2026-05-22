import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="timer-button"
  aria-label=""
  type="button"
  data-remaining-seconds=""
>
  <!-- Consumer provides content -->
</button>`;

const meta = {
  title: 'Headless/TimerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
