import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SverigePersonnummerInput from './SverigePersonnummerInput.vue';

const meta = {
  title: 'Headless/SverigePersonnummerInput',
  component: SverigePersonnummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof SverigePersonnummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SverigePersonnummerInput' }
};
