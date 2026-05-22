import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="united-kingdom-national-health-service-number-view"></span>`;

const meta = {
  title: 'Headless/UnitedKingdomNationalHealthServiceNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
