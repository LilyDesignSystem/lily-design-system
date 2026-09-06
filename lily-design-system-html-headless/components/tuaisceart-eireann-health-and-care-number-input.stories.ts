import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="tuaisceart-eireann-health-and-care-number-input"
  type="text"
  aria-label=""
  inputmode="numeric"
  pattern="[0-9]{3} [0-9]{3} [0-9]{4}"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/TuaisceartEireannHealthAndCareNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
