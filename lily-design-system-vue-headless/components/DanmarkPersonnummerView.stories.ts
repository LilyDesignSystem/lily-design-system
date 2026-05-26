import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DanmarkPersonnummerView from './DanmarkPersonnummerView.vue';

const meta = {
  title: 'Headless/DanmarkPersonnummerView',
  component: DanmarkPersonnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof DanmarkPersonnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'DanmarkPersonnummerView' }
};
