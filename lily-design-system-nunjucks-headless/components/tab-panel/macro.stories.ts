import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tab-panel"
  role="tabpanel"  tabindex="0" hidden></div>`;

const meta = {
  title: 'Headless/TabPanel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
