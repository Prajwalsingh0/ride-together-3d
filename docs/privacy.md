# Privacy Model

1. **Private rides only** — join requires a code; no public live-location URLs.
2. **Membership required** — server rejects location events from non-members.
3. **Identity from session** — client-provided userId is ignored; server uses authenticated socket/session.
4. **Active ride only** — location shared while in ride membership.
5. **Leave stops sharing** — leave ride + socket disconnect ends broadcasts.
6. **Retention** — in-memory keeps ~500 points per ride; production should TTL rows.
7. **Account deletion** — `DELETE /users/me` removes user and memberships.
8. **SOS is best-effort** — notifies ride members only; not a guaranteed emergency service.
