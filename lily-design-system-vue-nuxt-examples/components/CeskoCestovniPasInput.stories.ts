import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CeskoCestovniPasInput from './CeskoCestovniPasInput.vue';

const meta = {
  title: 'Headless/CeskoCestovniPasInput',
  component: CeskoCestovniPasInput,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoCestovniPasInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoCestovniPasInput' }
};
