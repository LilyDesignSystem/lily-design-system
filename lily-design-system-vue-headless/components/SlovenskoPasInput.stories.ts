import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SlovenskoPasInput from './SlovenskoPasInput.vue';

const meta = {
  title: 'Headless/SlovenskoPasInput',
  component: SlovenskoPasInput,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoPasInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoPasInput' }
};
