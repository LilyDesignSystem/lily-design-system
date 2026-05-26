import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SverigePersonnummerView from './SverigePersonnummerView.vue';

const meta = {
  title: 'Headless/SverigePersonnummerView',
  component: SverigePersonnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof SverigePersonnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SverigePersonnummerView' }
};
