import type { Meta, StoryObj } from '@storybook/react-vite';
import PrathetThaiLekPrajamTuaPrachachonView from './PrathetThaiLekPrajamTuaPrachachonView';

const meta = {
  title: 'Headless/PrathetThaiLekPrajamTuaPrachachonView',
  component: PrathetThaiLekPrajamTuaPrachachonView,
  tags: ['autodocs']
} satisfies Meta<typeof PrathetThaiLekPrajamTuaPrachachonView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PrathetThaiLekPrajamTuaPrachachonView' }
};
