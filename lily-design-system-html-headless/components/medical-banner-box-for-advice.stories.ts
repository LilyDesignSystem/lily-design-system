import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="medical-banner-box-for-advice"
  role="region"
  aria-label=""
  data-type="advice"
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/MedicalBannerBoxForAdvice',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
