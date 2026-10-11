import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DanmarkPersonnummerInput from './DanmarkPersonnummerInput.vue';

const meta = {
  title: 'Headless/DanmarkPersonnummerInput',
  component: DanmarkPersonnummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof DanmarkPersonnummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'DanmarkPersonnummerInput' }
};
