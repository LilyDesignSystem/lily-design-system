import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MexicoClaveUnicaDeRegistroDePoblacionView from './MexicoClaveUnicaDeRegistroDePoblacionView.vue';

const meta = {
  title: 'Headless/MexicoClaveUnicaDeRegistroDePoblacionView',
  component: MexicoClaveUnicaDeRegistroDePoblacionView,
  tags: ['autodocs']
} satisfies Meta<typeof MexicoClaveUnicaDeRegistroDePoblacionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MexicoClaveUnicaDeRegistroDePoblacionView' }
};
