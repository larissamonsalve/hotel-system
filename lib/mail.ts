import nodemailer from 'nodemailer';

interface SendOtpEmailParams {
  to: string;
  codigo: string;
  hotelNome: string;
  corPrincipal: string;
  corSecundaria: string;
}

export async function sendOtpEmail({
  to,
  codigo,
  hotelNome,
  corPrincipal,
  corSecundaria,
}: SendOtpEmailParams) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Fallback seguro apenas para ambiente local sem credenciais SMTP
  if (!smtpUser || !smtpPass) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n [DEV OTP] Hotel: ${hotelNome} | Para: ${to} | Código: ${codigo}\n`);
      return { success: true };
    }
    throw new Error('Serviço de e-mail SMTP não configurado em produção.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const nomeSeguro = hotelNome.replace(/"/g, '');

  await transporter.sendMail({
    from: `"${nomeSeguro}" <${smtpUser}>`,
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