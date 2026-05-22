import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<details
  class="expander">
  <summary class="expander-summary">More</summary>
  <div class="expander-body"></div>
</details>`;

const meta = {
  title: 'Headless/Expander',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
