import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="medical-banner"
  role="region" aria-label="Patient banner"></div>`;

const meta = {
  title: 'Headless/MedicalBanner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
