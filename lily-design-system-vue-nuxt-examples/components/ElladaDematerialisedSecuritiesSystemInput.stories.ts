import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ElladaDematerialisedSecuritiesSystemInput from './ElladaDematerialisedSecuritiesSystemInput.vue';

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
