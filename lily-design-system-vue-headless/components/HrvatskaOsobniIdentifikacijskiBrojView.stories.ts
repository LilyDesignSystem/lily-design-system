import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HrvatskaOsobniIdentifikacijskiBrojView from './HrvatskaOsobniIdentifikacijskiBrojView.vue';

const meta = {
  title: 'Headless/HrvatskaOsobniIdentifikacijskiBrojView',
  component: HrvatskaOsobniIdentifikacijskiBrojView,
  tags: ['autodocs']
} satisfies Meta<typeof HrvatskaOsobniIdentifikacijskiBrojView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'HrvatskaOsobniIdentifikacijskiBrojView' }
};
