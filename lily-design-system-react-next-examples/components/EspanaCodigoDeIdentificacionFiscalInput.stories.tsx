import type { Meta, StoryObj } from '@storybook/react-vite';
import EspanaCodigoDeIdentificacionFiscalInput from './EspanaCodigoDeIdentificacionFiscalInput';

const meta = {
  title: 'Headless/EspanaCodigoDeIdentificacionFiscalInput',
  component: EspanaCodigoDeIdentificacionFiscalInput,
  tags: ['autodocs']
} satisfies Meta<typeof EspanaCodigoDeIdentificacionFiscalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EspanaCodigoDeIdentificacionFiscalInput' }
};
