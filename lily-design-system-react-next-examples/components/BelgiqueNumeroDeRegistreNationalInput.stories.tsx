import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BelgiqueNumeroDeRegistreNationalInput from './BelgiqueNumeroDeRegistreNationalInput';

const meta = {
  title: 'Examples/BelgiqueNumeroDeRegistreNationalInput',
  component: BelgiqueNumeroDeRegistreNationalInput,
  tags: ['autodocs']
} satisfies Meta<typeof BelgiqueNumeroDeRegistreNationalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BelgiqueNumeroDeRegistreNationalInput' }
};
