import type { Meta, StoryObj } from '@storybook/react-vite';
import PolskaPeselInput from './PolskaPeselInput';

const meta = {
  title: 'Headless/PolskaPeselInput',
  component: PolskaPeselInput,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaPeselInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaPeselInput' }
};
