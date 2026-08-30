import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EspanaCodigoDeIdentificacionFiscalView from './EspanaCodigoDeIdentificacionFiscalView';

const meta = {
  title: 'Examples/EspanaCodigoDeIdentificacionFiscalView',
  component: EspanaCodigoDeIdentificacionFiscalView,
  tags: ['autodocs']
} satisfies Meta<typeof EspanaCodigoDeIdentificacionFiscalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EspanaCodigoDeIdentificacionFiscalView' }
};
