import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SuomiHenkilotunnusInput from './SuomiHenkilotunnusInput.vue';

const meta = {
  title: 'Headless/SuomiHenkilotunnusInput',
  component: SuomiHenkilotunnusInput,
  tags: ['autodocs']
} satisfies Meta<typeof SuomiHenkilotunnusInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SuomiHenkilotunnusInput' }
};
