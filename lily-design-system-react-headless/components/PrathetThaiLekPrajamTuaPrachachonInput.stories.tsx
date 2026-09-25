import type { Meta, StoryObj } from '@storybook/react-vite';
import PrathetThaiLekPrajamTuaPrachachonInput from './PrathetThaiLekPrajamTuaPrachachonInput';

const meta = {
  title: 'Headless/PrathetThaiLekPrajamTuaPrachachonInput',
  component: PrathetThaiLekPrajamTuaPrachachonInput,
  tags: ['autodocs']
} satisfies Meta<typeof PrathetThaiLekPrajamTuaPrachachonInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PrathetThaiLekPrajamTuaPrachachonInput' }
};
