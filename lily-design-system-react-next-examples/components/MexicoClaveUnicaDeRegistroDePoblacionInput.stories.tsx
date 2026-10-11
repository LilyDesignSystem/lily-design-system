import type { Meta, StoryObj } from '@storybook/react-vite';
import MexicoClaveUnicaDeRegistroDePoblacionInput from './MexicoClaveUnicaDeRegistroDePoblacionInput';

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
