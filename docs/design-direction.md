# Sambat — design direction

Research included current musician and artist work on [Webflow's Made in Webflow gallery](https://webflow.com/made-in-webflow/musicians) and [Framer's artist templates](https://www.framer.com/marketplace/templates/categories/artists/). The direction borrows their editorial restraint and atmosphere, while keeping ticket purchase exceptionally direct on mobile.

1. **Editorial dark canvas:** near-black layers create a credible club-night backdrop without turning every section into a neon effect.
2. **Gold as an action signal:** gold only marks dates, money, and the next action; cyan remains a secondary information accent.
3. **A ticket as the product:** selection uses collectible ticket cards rather than a generic quantity table, with an optional artwork-led tier image.
4. **Bottom-sheet checkout:** mobile uses a thumb-reachable, focus-preserving sheet; desktop presents the same sheet as a contained modal.
5. **Tight motion language:** 160ms press response and 280–500ms opacity/transform transitions make navigation feel composed rather than theatrical.
6. **One-time reveals:** sections enter once through IntersectionObserver; no continuous scroll effects, layout animation, or motion on reduced/low-capability devices.
7. **Clear state hierarchy:** sale status, inventory, error, payment and fulfilment each have one visual color and direct copy.

Tokens live in `app/globals.css`: `--space-section`, `--radius-card`, gold/cyan accents, and shared easing/duration values. Montserrat carries display moments, Inter preserves checkout legibility, and 20px cards soften the technical glass surface into a premium night-life identity.
