import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ChileRolUnicoNacionalInput from './ChileRolUnicoNacionalInput.vue';

const meta = {
  title: 'Headless/ChileRolUnicoNacionalInput',
  component: ChileRolUnicoNacionalInput,
  tags: ['autodocs']
} satisfies Meta<typeof ChileRolUnicoNacionalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ChileRolUnicoNacionalInput' }
};
