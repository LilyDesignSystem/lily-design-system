import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LatvijaPersonasKodsInput from './LatvijaPersonasKodsInput';

const meta = {
  title: 'Examples/LatvijaPersonasKodsInput',
  component: LatvijaPersonasKodsInput,
  tags: ['autodocs']
} satisfies Meta<typeof LatvijaPersonasKodsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LatvijaPersonasKodsInput' }
};
