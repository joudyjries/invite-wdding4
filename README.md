# A love story unfolds

A portrait wedding invitation built with React, TypeScript and Vite.

- `npm run dev`: local preview.
- `npm run build`: production build and TypeScript check.
- `npm run lint`: ESLint.

Edit the `wedding` object in `src/weddingDetails.ts` to change Aurelia and Sebastian. Names are real selectable HTML text, not baked into an image. No unconfirmed date or venue is shown.

The opening waits for all three images to decode. After a 1.8-second hold, two photographic velvet panels open over 8.8 seconds. The family line, names and dedication appear gradually. Pause freezes the entire CSS timeline, cloth movement and canvas glitter. Replay resets the sequence. Reduced-motion users see the open invitation with static imagery. Hidden tabs pause CSS timelines and particles.

The couple is a photographic cutout animated on a subdivided WebGL mesh in src/DancingCouple.tsx. The shoulders turn about the waist, the joined hands follow a small arc, weight shifts above planted feet, and the skirt follows with a slight delay. This is constrained 2D image deformation, not a generated video or a full 3D dance with new viewpoints. A still image remains as a fallback when WebGL is unavailable. Pause, replay and reduced-motion settings control both the mesh animation and the CSS timeline. No 3D characters, video generation APIs, Weave or Figma connections are used.

## Image assets and prompts

Generated using the built-in image generation tool, with the supplied curtain and wedding invitation references guiding the mood. Final files:

- `public/images/velvet-curtains.png`: photographic closed deep crimson velvet theatre curtains, dense vertical folds, central seam, tiny champagne glitter; no text or phone frame.
- `public/images/romantic-stage.png`: dark burgundy portrait theatre, glowing amber circular stage and sweeping translucent crimson chiffon arc, golden dust; empty stage, upper negative space, no text or people.
- `public/images/dancing-couple.png`: transparent photographic full-body bride and groom in a romantic waltz embrace, black tuxedo and ivory satin gown, dramatic golden rim light, believable anatomy; no scenery or text. Original alpha is preserved.

Great Vibes and Cormorant Garamond load from Google Fonts with local serif/script fallbacks. The generated image assets live inside the project; there are no remote image dependencies.


## Scroll letter

`src/EnvelopeLetter.tsx` and `src/envelope.css` add a second full-screen section below the dancing scene. The first scene links to it with a subtle scroll hint. When at least 60% of the letter section enters the viewport and its artwork has decoded, the flap unfolds and the paper rises automatically. The sequence runs once and the open letter remains readable on re-entry. Reduced-motion users see the open letter without animation. All letter text is editable HTML.

Additional assets generated with the built-in image generation tool from the supplied reference:

- `public/images/burgundy-satin.png`: photographic deep burgundy silk satin, glossy diagonal folds and dark central negative space; fabric only, no text, phone or objects.
- `public/images/embroidered-envelope.png`: transparent front pocket of a crimson velvet damask envelope with gold embroidery, scalloped trim and a deep V opening; no paper, flap, lettering or background. Its original alpha is preserved. The back and moving flap are assembled in code so the paper can emerge between real layers.

The ignored `.preview/check-envelope.mjs` checks that scrolling triggers the animation only at the intended visibility, the flap opens before the paper moves, the signature clears the pocket, re-entry preserves the open state, and small-screen and reduced-motion layouts remain usable.

## Save the date calendar

`src/WeddingCalendar.tsx` and `src/calendar.css` add the third scroll section. Edit the `weddingDate` constant to change the destination; it is currently 26 December 2026. The starting date is computed in `Asia/Damascus`, and the month grids use UTC calendar arithmetic with Monday-first weeks.

When 60% of the section enters the viewport, the current month holds briefly, then actual paper layers turn at their top binding until the wedding month is visible. The final day gets a drawn gold circle and an accessible final-date announcement. Re-entry keeps the calendar at the wedding date. Reduced-motion users skip the page turn. If the current date has already reached or passed the wedding month, the wedding month is displayed directly. Long intervals use a bounded set of intermediate months.

The calendar uses HTML, SVG and CSS, reusing the local satin background. No extra images or dependencies are required. The ignored `.preview/check-calendar.mjs` verifies the Damascus midnight boundary, month/day alignment, visibility trigger, automatic turn, final highlight, re-entry, mobile layouts, reduced motion and dates after the wedding.

## The evening

`src/EveningDetails.tsx` and `src/evening.css` add the fourth section after the calendar. The draft schedule follows the reference: 5:30 PM welcome, 6:00 PM ceremony, 7:00 PM dinner, 9:00 PM first dance and 11:30 PM sparklers. Edit `eveningSchedule` to confirm or change the events. The timeline and rows reveal once when 35% of the section is visible. Short screens can scroll through the whole card and reply button; text remains at least 12px. Reduced motion shows the itinerary immediately.

The Reply to the invitation link opens WhatsApp for the host-confirmed number with a prefilled RSVP message. It does not send a message automatically. The ignored `.preview/check-evening.mjs` checks the destination and encoded message without opening the external conversation, plus section order, row visibility, draft times, responsive layout and reduced motion.

Additional asset, generated with the built-in image generation tool:

- `public/images/evening-stationery.png`: photographic warm ivory cotton paper, delicate metallic champagne-gold floral lace bands along the top and bottom, faint botanical filigree at the margins, clean empty writing space; no typography, phone, hands or other objects. All schedule text is separate HTML.

## The venue

`src/WeddingVenue.tsx` and `src/venue.css` add the fifth section after the evening itinerary. At the user's request, Villa Balbiano in Ossuccio, Lake Como, is used as a replaceable demo venue. The name, displayed address and map query live together in the `venue` object. Address source: the Comune di Tremezzina official listing, https://www.comune.tremezzina.co.it/vivere_il_comune/luoghi/luogo_15.html (Piazza Cardinal Durini, 22010 Ossuccio).

An arched gold photo frame, address, Google Maps directions, embedded map, external map link and WhatsApp RSVP follow the reference. The map iframe is not created until the section enters the viewport. External directions and map links remain available independently of the embed. RSVP uses the host-confirmed WhatsApp recipient and opens a prefilled message without sending it. The section reveals once on entry and respects reduced motion.

New asset generated using the built-in image generation tool:

- `public/images/venue-atmosphere.png`: generic photographic candlelit wedding table in a formal cypress garden at golden dusk, ivory tablecloths, crystal, white flowers and dark wooden chairs; no people, text or identifiable real venue. This is explicitly illustrative wedding atmosphere, not a photograph of Villa Balbiano; the visible caption reflects that.

The ignored `.preview/check-venue.mjs` checks section order, image decode, deferred map creation, map navigation destination, confirmed RSVP link, responsive layout, re-entry and reduced motion without sending any messages.

## Floating reply

The RSVP link is now a single shared viewport-fixed control in `src/FloatingReply.tsx`, mounted through a portal to the document body. It appears as the evening section enters view, remains fixed while scrolling through the itinerary and venue, and hides again above the evening section to preserve the opening sequence. It retains the same gold pill design and confirmed WhatsApp recipient. Duplicate inline reply buttons were removed. The page reserves bottom space so the last map link can scroll clear of the floating control; safe-area insets are respected.

## Dress code

`src/DressCode.tsx` and `src/dress-code.css` add the sixth section after the venue, with photographic satin, velvet, sequins and pearls, the Midnight/Bordeaux/Ruby/Champagne/Blush palette, and the reference's attire guidance. The shared floating RSVP remains visible. Content reveals once on scroll, remains visible on re-entry, and respects reduced motion. The small-screen layout remains vertically scrollable.

New asset generated using the built-in image generation tool:

- `public/images/dress-materials.png`: a precise equal-quadrant 2x2 photographic textile atlas: ruby silk satin, dark burgundy velvet, red sequins and an ivory pearl strand over champagne satin; realistic macro texture, warm editorial light, no text, borders or people. CSS background positions show the four quadrants individually without modifying the original raster.


## A few little notes and RSVP

`src/WeddingNotes.tsx` adds three raised ivory cards after the dress code: Gifts, An evening for grown-ups, and Unplugged vows. The existing stationery image is reused; no new image assets are needed. Cards reveal once and respect reduced motion.

`src/RsvpForm.tsx` adds the final RSVP section. It accepts a required full name, one of three required attendance choices, and an optional note. Names are trimmed and repeated spaces are collapsed; empty or whitespace-only names and missing attendance are rejected with accessible inline errors and focus on the first invalid field. Inputs use readable mobile sizes. Values stay in React memory; no database or automatic local storage is involved.

The submit action opens WhatsApp for the confirmed recipient with a URL-encoded message containing the selected response, name, wedding date and optional note. The guest must finish sending in WhatsApp. The UI explicitly describes that handoff and offers a usable message link if the browser blocks the popup; it never claims the RSVP has been sent or received. Editing the form clears an outdated handoff link.

Names, wedding date and reply number now share `src/weddingDetails.ts`, including the calendar date. The floating reply control now scrolls to `#rsvp` and hides while the form is in view so it cannot cover the fields or keyboard.

The ignored `.preview/check-rsvp.mjs` checks validation, whitespace normalization, all three attendance choices, Unicode/newline message encoding, popup fallback, responsive layouts, reduced motion and floating-control behavior. WhatsApp opens are intercepted in the test; no external message is sent.

## Background music

`src/BackgroundMusic.tsx` plays the user-provided Adele – Skyfall M4A, copied unchanged to `public/audio/skyfall.m4a`. It attempts audible playback on page load at 45% volume and loops continuously across sections. When the browser blocks autoplay, the first page click, touch or keyboard interaction retries playback; a persistent top music button also starts it explicitly. Playback state comes from media events. Once the guest pauses music, unrelated interactions do not restart it. Unmount cleanup removes the gesture/media listeners and pauses the audio.

Autoplay with sound depends on browser policy: https://developer.chrome.com/blog/autoplay. The ignored `.preview/check-music.mjs` verifies actual M4A decoding and playback, allowed autoplay, simulated policy denial, first-gesture and explicit-button recovery, manual pause/resume, one audio element under StrictMode, and continuous playback across sections. Test Chrome runs with its audio output silenced.
