import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="accordion-checkbox">
  <input
    type="checkbox"
    class="accordion-checkbox-input"
    id="undefined-checkbox"
    aria-controls="undefined-panel"
    aria-expanded="false"  />
  <label class="accordion-checkbox-label" for="undefined-checkbox">
    
  </label>
  <div
    class="accordion-checkbox-panel"
    id="undefined-panel"
    role="region"
    aria-labelledby="undefined-checkbox" hidden  ></div>
</div>`;

const meta = {
  title: 'Headless/AccordionCheckbox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
