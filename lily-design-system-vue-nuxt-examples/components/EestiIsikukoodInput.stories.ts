import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EestiIsikukoodInput from './EestiIsikukoodInput.vue';

const meta = {
  title: 'Headless/EestiIsikukoodInput',
  component: EestiIsikukoodInput,
  tags: ['autodocs']
} satisfies Meta<typeof EestiIsikukoodInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EestiIsikukoodInput' }
};
