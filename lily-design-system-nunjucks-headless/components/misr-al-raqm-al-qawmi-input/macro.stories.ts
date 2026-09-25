import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="misr-al-raqm-al-qawmi-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="الرقم القومي (Al-Raqm Al-Qawmi)">`;

const meta = {
  title: 'Headless/MisrAlRaqmAlQawmiInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
