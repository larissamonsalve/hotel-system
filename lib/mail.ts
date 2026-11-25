import nodemailer from 'nodemailer';

interface SendOtpEmailParams {
  to: string;
  codigo: string;
  hotelNome: string;
  corPrincipal: string;
  corSecundaria: string;
}

interface SendConfirmationEmailParams {
  to: string;
  hospedeNome: string;
  codigoLocalizador: string;
  hotelNome: string;
  hotelEndereco: string | null;
  corPrincipal: string;
  corSecundaria: string;
  quartoTipo: string;
  checkInLabel: string;
  checkOutLabel: string;
  valorPagoLabel: string;
  saldoRestanteLabel: string;
  metodoLabel: string;
  voucherUrl: string;
  pdfBuffer: Buffer;
}

function createTransporter() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  return {
    smtpUser,
    transporter: nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    }),
  };
}

export async function sendOtpEmail({
  to,
  codigo,
  hotelNome,
  corPrincipal,
  corSecundaria,
}: SendOtpEmailParams) {
  const mailClient = createTransporter();

  if (!mailClient) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n [DEV OTP] Hotel: ${hotelNome} | Para: ${to} | Código: ${codigo}\n`);
      return { success: true };
    }
    throw new Error('Serviço de e-mail SMTP não configurado em produção.');
  }

  const nomeSeguro = hotelNome.replace(/"/g, '');

  await mailClient.transporter.sendMail({
    from: `"${nomeSeguro}" <${mailClient.smtpUser}>`,
    to,
    subject: `${codigo} é o seu código de verificação — ${hotelNome}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid ${corSecundaria};">
          <h2 style="margin: 0; color: ${corPrincipal}; font-size: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${hotelNome}
          </h2>
        </div>

        <div style="padding: 24px 0; text-align: center;">
          <p style="color: #334155; font-size: 15px; margin: 0 0 12px;">
            Olá! Utilize o código abaixo para confirmar seu e-mail e avançar para o pagamento da sua reserva:
          </p>

          <div style="display: inline-block; padding: 16px 32px; margin: 12px 0; background-color: #f8fafc; border: 1px dashed ${corPrincipal}; border-radius: 12px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: ${corPrincipal};">
              ${codigo}
            </span>
          </div>

          <p style="color: #64748b; font-size: 13px; margin: 16px 0 0;">
            Este código expira em <strong>5 minutos</strong> e pode ser utilizado apenas uma vez.
          </p>
        </div>

        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 11px;">
          Se você não solicitou este código, ignore este e-mail com segurança.
        </div>
      </div>
    `,
  });

  return { success: true };
}

export async function sendReservationConfirmationEmail(params: SendConfirmationEmailParams) {
  const mailClient = createTransporter();

  if (!mailClient) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `\n [DEV CONFIRMAÇÃO] Código da reserva: ${params.codigoLocalizador} | Para: ${params.to} | Pago: ${params.valorPagoLabel}\n`
      );
      return { success: true };
    }
    throw new Error('Serviço de e-mail SMTP não configurado em produção.');
  }

  const nomeSeguro = params.hotelNome.replace(/"/g, '');
  const primeiroNome = params.hospedeNome.split(' ')[0];

  await mailClient.transporter.sendMail({
    from: `"${nomeSeguro}" <${mailClient.smtpUser}>`,
    to: params.to,
    subject: `Reserva confirmada #${params.codigoLocalizador} — ${params.hotelNome}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: ${params.corPrincipal}; padding: 28px 24px; color: #ffffff;">
          <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.85;">
            Pagamento aprovado • Código da reserva
          </p>
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 3px;">${params.codigoLocalizador}</h1>
          <p style="margin: 8px 0 0; font-size: 13px; opacity: 0.9;">${params.hotelNome}</p>
        </div>

        <div style="padding: 28px 24px; color: #334155;">
          <p style="margin: 0 0 18px; font-size: 15px;">
            Olá, <strong>${primeiroNome}</strong>! Sua reserva está confirmada. O comprovante completo em PDF segue anexado a este e-mail.
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Acomodação</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right; border-bottom: 1px solid #f1f5f9;">${params.quartoTipo}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Check-in</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right; border-bottom: 1px solid #f1f5f9;">${params.checkInLabel} (após 14h)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Check-out</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right; border-bottom: 1px solid #f1f5f9;">${params.checkOutLabel} (até 12h)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #059669; border-bottom: 1px solid #f1f5f9;">Taxa de reserva paga (${params.metodoLabel})</td>
              <td style="padding: 8px 0; color: #059669; font-weight: bold; text-align: right; border-bottom: 1px solid #f1f5f9;">${params.valorPagoLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Saldo restante no hotel (70%)</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${params.saldoRestanteLabel}</td>
            </tr>
          </table>

          <div style="text-align: center; margin: 24px 0 8px;">
            <a href="${params.voucherUrl}" style="display: inline-block; background-color: ${params.corSecundaria}; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 13px 26px; border-radius: 10px;">
              Ver detalhes da reserva
            </a>
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 12px;">
          ${params.hotelEndereco ? `<p style="margin: 0 0 4px;">${params.hotelEndereco}</p>` : ''}
          <p style="margin: 0;">Apresente o código da reserva <strong>${params.codigoLocalizador}</strong> na recepção no check-in.</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `comprovante-reserva-${params.codigoLocalizador}.pdf`,
        content: params.pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  return { success: true };
}