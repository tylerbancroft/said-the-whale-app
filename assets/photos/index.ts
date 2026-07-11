/**
 * Band photo archive — full-bleed backgrounds for the photo pages (Albums, Chat,
 * Tour, News). Static requires so the Metro bundler picks them up.
 *
 * NOTE: these are full-resolution (1–3 MB each). Resize/optimize before a
 * production release to keep the app bundle small (tracked in issue #1).
 */
export const PHOTOS = [
  require('./IMG_7223-CROP.jpg'),
  require('./IMG_7415.jpg'),
  require('./IMG_7579.jpg'),
  require('./IMG_7904.jpg'),
  require('./R1-07892-000A_0001.jpg'),
  require('./R1-07892-010A.jpg'),
  require('./R1-07896-003A.jpg'),
  require('./R1-07896-004A.jpg'),
  require('./R1-07896-006A.jpg'),
  require('./R1-07896-020A.jpg'),
  require('./R1-07896-025A.jpg'),
] as const;

export const PHOTO_COUNT = PHOTOS.length;
