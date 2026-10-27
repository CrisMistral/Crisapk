// Claves VAPID de los recordatorios: se crean solas la primera vez y se guardan en
// Netlify Blobs (almacén privado de las funciones). Si se perdieran, se crearían otras
// y los móviles se volverían a suscribir solos al abrir Quico.
import webpush from 'web-push';
import { getStore } from '@netlify/blobs';

let cached = null;
export async function vapid() {
  if (cached) return cached;
  const cfg = getStore({ name: 'quico-push-cfg', consistency: 'strong' });
  let v = await cfg.get('vapid', { type: 'json' });
  if (!v || !v.publicKey || !v.privateKey) {
    v = webpush.generateVAPIDKeys();
    await cfg.setJSON('vapid', v);
    v = (await cfg.get('vapid', { type: 'json' })) || v; // si otra llamada la creó a la vez, gana la guardada
  }
  return (cached = v);
}
export { webpush };
