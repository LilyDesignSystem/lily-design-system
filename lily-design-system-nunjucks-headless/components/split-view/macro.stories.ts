import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="split-view"  data-orientation="horizontal"
  data-split-percent="50">
  <section class="split-view-primary"></section>  <div
    class="split-view-divider"
    role="separator"
    aria-orientation="horizontal"
    aria-valuenow="50"
    aria-valuemin="0"
    aria-valuemax="100"
    tabindex="0"
  ></div>  <section class="split-view-secondary"></section>
</div>`;

const meta = {
  title: 'Headless/SplitView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
