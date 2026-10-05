import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure class="scatter-chart">
  <!-- role="img" lives on the graphic wrapper, never on the figure: it makes
       its descendants presentational, so a data table inside it would be
       invisible to assistive technology. -->
  <div class="scatter-chart-graphic" role="img" aria-label="Example">
    <!-- Consumer provides the inline svg; no drawing happens in this component. -->
    <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" cx="5" cy="5"></circle></svg>
  </div>
  <!-- Optional accessible table alternative: a SIBLING of the graphic, outside role="img". -->
  <div class="scatter-chart-data-table">
    <table>
      <caption>Values</caption>
      <tbody><tr><th scope="row">A</th><td>1</td></tr></tbody>
    </table>
  </div>
</figure>`;

const meta = {
  title: 'Headless/ScatterChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
