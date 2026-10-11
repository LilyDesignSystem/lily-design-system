import type { Meta, StoryObj } from '@storybook/vue3-vite';
import YisraelTeudatZehutInput from './YisraelTeudatZehutInput.vue';

const meta = {
  title: 'Headless/YisraelTeudatZehutInput',
  component: YisraelTeudatZehutInput,
  tags: ['autodocs']
} satisfies Meta<typeof YisraelTeudatZehutInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'YisraelTeudatZehutInput' }
};
