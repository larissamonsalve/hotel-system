import { NextResponse } from 'next/server';
import { createLeadSchema } from '@/schemas/lead.schema';
import { LeadService } from '@/services/lead.service';
import { HotelRepository } from '@/repositories/hotel.repository';
import { checkRateLimit } from '@/lib/rate-limit';
import { ZodError } from 'zod';

const leadService = new LeadService();
const hotelRepository = new HotelRepository();

export async function POST(request: Request) {
  try {
    const tenantSlug = request.headers.get('x-tenant-slug');

    if (!tenantSlug) {
      return NextResponse.json({ error: 'Tenant não identificado.' }, { status: 400 });
    }

    const hotel = await hotelRepository.buscarPorSlug(tenantSlug);

    if (!hotel || !hotel.ativo) {
      return NextResponse.json({ error: 'Estabelecimento inativo ou não encontrado.' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Formato inválido.' }, { status: 415 });
    }

    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const isAllowed = checkRateLimit(ip, 5, 60000);

    if (!isAllowed) {
      return NextResponse.json({ error: 'Muitas tentativas detectadas.' }, { status: 429 });
    }

    const body = await request.json();
    const validatedData = createLeadSchema.parse(body);

    const lead = await leadService.registrarLead(hotel.id, validatedData);

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos.',
          details: error.issues.map((e) => ({
            campo: e.path.join('.'),
            mensagem: e.message,
          })),
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}