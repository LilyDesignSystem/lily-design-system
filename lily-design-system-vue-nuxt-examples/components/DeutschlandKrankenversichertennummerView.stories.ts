import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DeutschlandKrankenversichertennummerView from './DeutschlandKrankenversichertennummerView.vue';

const meta = {
  title: 'Headless/DeutschlandKrankenversichertennummerView',
  component: DeutschlandKrankenversichertennummerView,
  tags: ['autodocs']
} satisfies Meta<typeof DeutschlandKrankenversichertennummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'DeutschlandKrankenversichertennummerView' }
};
