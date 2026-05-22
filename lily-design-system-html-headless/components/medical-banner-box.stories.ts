import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="medical-banner-box"
  data-context="medical"
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/MedicalBannerBox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
