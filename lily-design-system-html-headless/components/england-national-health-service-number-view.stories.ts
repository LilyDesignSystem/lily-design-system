import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="england-national-health-service-number-view"
  aria-label="National Health Service Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/EnglandNationalHealthServiceNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
