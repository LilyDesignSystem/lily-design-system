import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="accordion-list-item">
  <details
    class="accordion-list-item-details"  >
    <summary class="accordion-list-item-summary"></summary>
    <div class="accordion-list-item-body"></div>
  </details>
</li>`;

const meta = {
  title: 'Headless/AccordionListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
