import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<details
  class="details">
  <summary class="details-summary">
    <span class="details-summary-text"></span>
  </summary>
  <div class="details-text"></div>
</details>`;

const meta = {
  title: 'Headless/Details',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
