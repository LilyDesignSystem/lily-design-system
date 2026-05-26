import type { Meta, StoryObj } from '@storybook/react-vite';
import BelgiqueNumeroDeRegistreNationalView from './BelgiqueNumeroDeRegistreNationalView';

const meta = {
  title: 'Headless/BelgiqueNumeroDeRegistreNationalView',
  component: BelgiqueNumeroDeRegistreNationalView,
  tags: ['autodocs']
} satisfies Meta<typeof BelgiqueNumeroDeRegistreNationalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BelgiqueNumeroDeRegistreNationalView' }
};
