import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MexicoClaveUnicaDeRegistroDePoblacionInput from './MexicoClaveUnicaDeRegistroDePoblacionInput.vue';

const meta = {
  title: 'Headless/MexicoClaveUnicaDeRegistroDePoblacionInput',
  component: MexicoClaveUnicaDeRegistroDePoblacionInput,
  tags: ['autodocs']
} satisfies Meta<typeof MexicoClaveUnicaDeRegistroDePoblacionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MexicoClaveUnicaDeRegistroDePoblacionInput' }
};
