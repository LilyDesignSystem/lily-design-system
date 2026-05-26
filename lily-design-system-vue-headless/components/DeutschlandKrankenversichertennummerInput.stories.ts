import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DeutschlandKrankenversichertennummerInput from './DeutschlandKrankenversichertennummerInput.vue';

const meta = {
  title: 'Headless/DeutschlandKrankenversichertennummerInput',
  component: DeutschlandKrankenversichertennummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof DeutschlandKrankenversichertennummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'DeutschlandKrankenversichertennummerInput' }
};
