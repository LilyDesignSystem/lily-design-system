import type { Meta, StoryObj } from '@storybook/react-vite';
import KyprosNationalPassportNumberView from './KyprosNationalPassportNumberView';

const meta = {
  title: 'Headless/KyprosNationalPassportNumberView',
  component: KyprosNationalPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof KyprosNationalPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'KyprosNationalPassportNumberView' }
};
