import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="misr-al-raqm-al-qawmi-input"
  type="text"
  aria-label="الرقم القومي (Al-Raqm Al-Qawmi)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/MisrAlRaqmAlQawmiInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
