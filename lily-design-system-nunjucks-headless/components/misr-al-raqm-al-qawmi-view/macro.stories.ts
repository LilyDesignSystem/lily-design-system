import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="misr-al-raqm-al-qawmi-view"
  aria-label="الرقم القومي (Al-Raqm Al-Qawmi)">sample-value</span>`;

const meta = {
  title: 'Headless/MisrAlRaqmAlQawmiView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
