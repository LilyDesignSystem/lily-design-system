import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ElladaDematerialisedSecuritiesSystemView from './ElladaDematerialisedSecuritiesSystemView';

const meta = {
  title: 'Examples/ElladaDematerialisedSecuritiesSystemView',
  component: ElladaDematerialisedSecuritiesSystemView,
  tags: ['autodocs']
} satisfies Meta<typeof ElladaDematerialisedSecuritiesSystemView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ElladaDematerialisedSecuritiesSystemView' }
};
