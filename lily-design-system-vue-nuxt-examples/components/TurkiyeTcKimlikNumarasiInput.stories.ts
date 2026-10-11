import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TurkiyeTcKimlikNumarasiInput from './TurkiyeTcKimlikNumarasiInput.vue';

const meta = {
  title: 'Headless/TurkiyeTcKimlikNumarasiInput',
  component: TurkiyeTcKimlikNumarasiInput,
  tags: ['autodocs']
} satisfies Meta<typeof TurkiyeTcKimlikNumarasiInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'TurkiyeTcKimlikNumarasiInput' }
};
