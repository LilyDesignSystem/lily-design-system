import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import KyprosNationalPassportNumberView from './KyprosNationalPassportNumberView';

const meta = {
  title: 'Examples/KyprosNationalPassportNumberView',
  component: KyprosNationalPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof KyprosNationalPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'KyprosNationalPassportNumberView' }
};
