import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<details
  class="collapsible">
  <summary class="collapsible-summary"></summary>
  <div class="collapsible-body"></div>
</details>`;

const meta = {
  title: 'Headless/Collapsible',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
