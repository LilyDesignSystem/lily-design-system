import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="ellada-dematerialised-securities-system-view"
  aria-label="Dematerialised Securities System">sample-value</span>`;

const meta = {
  title: 'Headless/ElladaDematerialisedSecuritiesSystemView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
