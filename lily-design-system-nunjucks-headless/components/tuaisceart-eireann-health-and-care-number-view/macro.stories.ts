import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="tuaisceart-eireann-health-and-care-number-view"></span>`;

const meta = {
  title: 'Headless/TuaisceartEireannHealthAndCareNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
