export const revalidate = 86400

export function GET() {
  return new Response('google.com, pub-2501861627867479, DIRECT, f08c47fec0942fa0\n', {
    headers: { 'Content-Type': 'text/plain' },
  })
}
