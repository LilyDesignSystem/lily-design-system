import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BelgiqueNumeroDeRegistreNationalInput from './BelgiqueNumeroDeRegistreNationalInput.vue';

const meta = {
  title: 'Headless/BelgiqueNumeroDeRegistreNationalInput',
  component: BelgiqueNumeroDeRegistreNationalInput,
  tags: ['autodocs']
} satisfies Meta<typeof BelgiqueNumeroDeRegistreNationalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BelgiqueNumeroDeRegistreNationalInput' }
};
