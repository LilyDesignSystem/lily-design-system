import type { Meta, StoryObj } from '@storybook/react-vite';
import PortugalNumeroDeIdentificacaoFiscalInput from './PortugalNumeroDeIdentificacaoFiscalInput';

const meta = {
  title: 'Headless/PortugalNumeroDeIdentificacaoFiscalInput',
  component: PortugalNumeroDeIdentificacaoFiscalInput,
  tags: ['autodocs']
} satisfies Meta<typeof PortugalNumeroDeIdentificacaoFiscalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PortugalNumeroDeIdentificacaoFiscalInput' }
};
