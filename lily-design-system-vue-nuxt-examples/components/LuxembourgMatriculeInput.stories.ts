import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LuxembourgMatriculeInput from './LuxembourgMatriculeInput.vue';

const meta = {
  title: 'Headless/LuxembourgMatriculeInput',
  component: LuxembourgMatriculeInput,
  tags: ['autodocs']
} satisfies Meta<typeof LuxembourgMatriculeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LuxembourgMatriculeInput' }
};
