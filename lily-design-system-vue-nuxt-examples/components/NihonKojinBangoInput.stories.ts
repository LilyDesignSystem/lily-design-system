import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NihonKojinBangoInput from './NihonKojinBangoInput.vue';

const meta = {
  title: 'Headless/NihonKojinBangoInput',
  component: NihonKojinBangoInput,
  tags: ['autodocs']
} satisfies Meta<typeof NihonKojinBangoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NihonKojinBangoInput' }
};
