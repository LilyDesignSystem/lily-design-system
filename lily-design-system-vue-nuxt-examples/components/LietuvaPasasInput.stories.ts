import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LietuvaPasasInput from './LietuvaPasasInput.vue';

const meta = {
  title: 'Examples/LietuvaPasasInput',
  component: LietuvaPasasInput,
  tags: ['autodocs']
} satisfies Meta<typeof LietuvaPasasInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LietuvaPasasInput' }
};
