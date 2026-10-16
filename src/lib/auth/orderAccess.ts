export type Viewer = { id: string; role: string } | null;

/** A customer may read only an order linked to their own user id. Admins may read any. */
export function canReadOrder(viewer: Viewer, order: { userId: string | null }): boolean {
  if (!viewer) return false;
  if (viewer.role === 'ADMIN' || viewer.role === 'SUPER_ADMIN') return true;
  return Boolean(order.userId) && order.userId === viewer.id;
}
