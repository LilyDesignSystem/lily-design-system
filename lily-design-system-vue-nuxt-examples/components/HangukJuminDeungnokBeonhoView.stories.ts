import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HangukJuminDeungnokBeonhoView from './HangukJuminDeungnokBeonhoView.vue';

const meta = {
  title: 'Headless/HangukJuminDeungnokBeonhoView',
  component: HangukJuminDeungnokBeonhoView,
  tags: ['autodocs']
} satisfies Meta<typeof HangukJuminDeungnokBeonhoView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'HangukJuminDeungnokBeonhoView' }
};
