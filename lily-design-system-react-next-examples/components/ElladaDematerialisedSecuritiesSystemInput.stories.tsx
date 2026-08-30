import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ElladaDematerialisedSecuritiesSystemInput from './ElladaDematerialisedSecuritiesSystemInput';

const meta = {
  title: 'Examples/ElladaDematerialisedSecuritiesSystemInput',
  component: ElladaDematerialisedSecuritiesSystemInput,
  tags: ['autodocs']
} satisfies Meta<typeof ElladaDematerialisedSecuritiesSystemInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ElladaDematerialisedSecuritiesSystemInput' }
};
