import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface VoucherPdfData {
  codigoLocalizador: string;
  hotelNome: string;
  hotelEndereco: string | null;
  hotelTelefone: string | null;
  corPrincipal: string;
  corSecundaria: string;
  hospedeNome: string;
  hospedeEmail: string;
  cpfMascarado: string | null;
  quartoTipo: string;
  capacidade: number;
  checkIn: Date;
  checkOut: Date;
  qtdDiarias: number;
  valorTotal: number;
  valorPago: number;
  saldoRestante: number;
  metodoPagamento: string;
  dataConfirmacao: Date;
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return rgb(0.11, 0.16, 0.25);
  }

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

function safeText(text: string): string {
  return text.replace(/[^\x20-\x7E\xA0-\xFF]/g, '').trim();
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDateBR(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export async function generateVoucherPdf(data: VoucherPdfData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primary = hexToRgb(data.corPrincipal);
  const secondary = hexToRgb(data.corSecundaria);
  const slateDark = rgb(0.12, 0.16, 0.23);
  const slateMuted = rgb(0.39, 0.45, 0.54);
  const borderLight = rgb(0.88, 0.91, 0.94);
  const greenBg = rgb(0.92, 0.98, 0.95);
  const greenText = rgb(0.06, 0.45, 0.28);

  const headerHeight = 140;
  page.drawRectangle({
    x: 0,
    y: height - headerHeight,
    width,
    height: headerHeight,
    color: primary,
  });

  page.drawRectangle({
    x: 0,
    y: height - headerHeight - 4,
    width,
    height: 4,
    color: secondary,
  });

  page.drawText('COMPROVANTE DE RESERVA', {
    x: 48,
    y: height - 46,
    size: 10,
    font: fontBold,
    color: rgb(0.85, 0.9, 0.95),
  });

  page.drawText(safeText(data.hotelNome.toUpperCase()), {
    x: 48,
    y: height - 74,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  if (data.hotelEndereco) {
    page.drawText(safeText(data.hotelEndereco), {
      x: 48,
      y: height - 96,
      size: 10,
      font: fontRegular,
      color: rgb(0.85, 0.9, 0.95),
    });
  }

  page.drawRectangle({
    x: width - 196,
    y: height - 108,
    width: 148,
    height: 68,
    color: rgb(1, 1, 1),
    opacity: 0.14,
  });

  page.drawText('CODIGO DA RESERVA', {
    x: width - 182,
    y: height - 60,
    size: 8,
    font: fontBold,
    color: rgb(0.88, 0.92, 0.96),
  });

  page.drawText(safeText(data.codigoLocalizador), {
    x: width - 182,
    y: height - 92,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  let y = height - 195;
  page.drawRectangle({
    x: 48,
    y: y - 10,
    width: width - 96,
    height: 36,
    color: greenBg,
  });

  page.drawText('TAXA DE RESERVA APROVADA  |  RESERVA CONFIRMADA', {
    x: 64,
    y: y + 3,
    size: 10,
    font: fontBold,
    color: greenText,
  });

  // Seção: Dados da Estadia
  y -= 54;
  page.drawText('DETALHES DA ESTADIA', {
    x: 48,
    y,
    size: 10,
    font: fontBold,
    color: primary,
  });

  y -= 10;
  page.drawLine({
    start: { x: 48, y },
    end: { x: width - 48, y },
    thickness: 1,
    color: borderLight,
  });

  y -= 26;
  page.drawText('CHECK-IN (A partir das 14h)', {
    x: 48,
    y,
    size: 8,
    font: fontBold,
    color: slateMuted,
  });
  page.drawText('CHECK-OUT (Ate as 12h)', {
    x: 310,
    y,
    size: 8,
    font: fontBold,
    color: slateMuted,
  });

  y -= 18;
  page.drawText(safeText(formatDateBR(data.checkIn)), {
    x: 48,
    y,
    size: 13,
    font: fontBold,
    color: slateDark,
  });
  page.drawText(safeText(formatDateBR(data.checkOut)), {
    x: 310,
    y,
    size: 13,
    font: fontBold,
    color: slateDark,
  });

  y -= 34;
  page.drawText('ACOMODACAO', {
    x: 48,
    y,
    size: 8,
    font: fontBold,
    color: slateMuted,
  });
  page.drawText('HOSPEDE PRINCIPAL', {
    x: 310,
    y,
    size: 8,
    font: fontBold,
    color: slateMuted,
  });

  y -= 18;
  page.drawText(safeText(data.quartoTipo), {
    x: 48,
    y,
    size: 12,
    font: fontBold,
    color: slateDark,
  });
  page.drawText(safeText(data.hospedeNome), {
    x: 310,
    y,
    size: 12,
    font: fontBold,
    color: slateDark,
  });

  y -= 16;
  page.drawText(
    safeText(`${data.qtdDiarias} diaria(s)  |  Ate ${data.capacidade} hospede(s)`),
    {
      x: 48,
      y,
      size: 10,
      font: fontRegular,
      color: slateMuted,
    }
  );
  page.drawText(
    safeText(
      data.cpfMascarado
        ? `CPF ${data.cpfMascarado}  |  ${data.hospedeEmail}`
        : data.hospedeEmail
    ),
    {
      x: 310,
      y,
      size: 9.5,
      font: fontRegular,
      color: slateMuted,
    }
  );

  // Seção: Resumo Financeiro
  y -= 52;
  page.drawText('RESUMO FINANCEIRO', {
    x: 48,
    y,
    size: 10,
    font: fontBold,
    color: primary,
  });

  y -= 10;
  page.drawLine({
    start: { x: 48, y },
    end: { x: width - 48, y },
    thickness: 1,
    color: borderLight,
  });

  const rows: Array<[string, string, boolean]> = [
    ['Valor total da estadia', formatBRL(data.valorTotal), false],
    [
      `Taxa de reserva paga online (30% - ${safeText(data.metodoPagamento)})`,
      formatBRL(data.valorPago),
      true,
    ],
    ['Saldo restante a pagar no check-in (70%)', formatBRL(data.saldoRestante), false],
  ];

  for (const [label, value, highlight] of rows) {
    y -= 28;
    if (highlight) {
      page.drawRectangle({
        x: 48,
        y: y - 8,
        width: width - 96,
        height: 26,
        color: greenBg,
      });
    }
    page.drawText(label, {
      x: 56,
      y,
      size: 10.5,
      font: highlight ? fontBold : fontRegular,
      color: highlight ? greenText : slateDark,
    });
    page.drawText(safeText(value), {
      x: width - 145,
      y,
      size: 11,
      font: fontBold,
      color: highlight ? greenText : slateDark,
    });
  }

  // Rodapé institucional
  const footerY = 72;
  page.drawLine({
    start: { x: 48, y: footerY + 26 },
    end: { x: width - 48, y: footerY + 26 },
    thickness: 1,
    color: borderLight,
  });

  page.drawText(
    safeText(
      `Apresente o codigo da reserva ${data.codigoLocalizador} e um documento oficial com foto no check-in.`
    ),
    {
      x: 48,
      y: footerY + 8,
      size: 9.5,
      font: fontBold,
      color: slateDark,
    }
  );

  const contato = data.hotelTelefone ? `Contato do hotel: ${data.hotelTelefone}  |  ` : '';
  page.drawText(
    safeText(`${contato}Confirmado em ${formatDateBR(data.dataConfirmacao)}`),
    {
      x: 48,
      y: footerY - 8,
      size: 8.5,
      font: fontRegular,
      color: slateMuted,
    }
  );

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}