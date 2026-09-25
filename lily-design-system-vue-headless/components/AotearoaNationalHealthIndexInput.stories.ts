import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AotearoaNationalHealthIndexInput from './AotearoaNationalHealthIndexInput.vue';

const meta = {
  title: 'Headless/AotearoaNationalHealthIndexInput',
  component: AotearoaNationalHealthIndexInput,
  tags: ['autodocs']
} satisfies Meta<typeof AotearoaNationalHealthIndexInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AotearoaNationalHealthIndexInput' }
};
