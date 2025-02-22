export default async function MyTripSingle({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const slug = (await params).slug
    return <div>My Post: {slug}</div>
  }