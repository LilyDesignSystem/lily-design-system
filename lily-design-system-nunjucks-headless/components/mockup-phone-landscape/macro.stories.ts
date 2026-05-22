import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="mockup-phone-landscape"
  role="img"></div>`;

const meta = {
  title: 'Headless/MockupPhoneLandscape',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
