import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="medical-banner-box-for-advice"
  data-severity="advice"></div>`;

const meta = {
  title: 'Headless/MedicalBannerBoxForAdvice',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
