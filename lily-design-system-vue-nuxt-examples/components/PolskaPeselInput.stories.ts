import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PolskaPeselInput from './PolskaPeselInput.vue';

const meta = {
  title: 'Headless/PolskaPeselInput',
  component: PolskaPeselInput,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaPeselInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaPeselInput' }
};
