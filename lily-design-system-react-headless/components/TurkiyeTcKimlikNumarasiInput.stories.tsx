import type { Meta, StoryObj } from '@storybook/react-vite';
import TurkiyeTcKimlikNumarasiInput from './TurkiyeTcKimlikNumarasiInput';

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
