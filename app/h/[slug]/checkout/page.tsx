import CheckoutClient from '@/components/checkout/CheckoutClient';

type Params = Promise<{ slug: string }>;

export default async function CheckoutLeadPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  
  return (
    <CheckoutClient slug={resolvedParams.slug} />
  );
}