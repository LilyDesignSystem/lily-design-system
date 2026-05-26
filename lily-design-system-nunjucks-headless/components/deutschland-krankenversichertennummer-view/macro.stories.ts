import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="deutschland-krankenversichertennummer-view"
  aria-label="Health Insurance Number">sample-value</span>`;

const meta = {
  title: 'Headless/DeutschlandKrankenversichertennummerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
