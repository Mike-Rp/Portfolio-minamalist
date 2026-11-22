# Mikhail Respicio — Portfolio

Phase 1 of a personal portfolio, built with React, Vite, TypeScript, and Tailwind CSS. It contains the temporary navigation, hero introduction, calls to action, and three statistics from the approved reference image (`imagerefference.png`).

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm run build` for a production build.

## Typography and effects

- The site self-hosts [Clash Grotesk](https://fontshare.com/fonts/clash-grotesk) from Fontshare.
- Five React Bits TypeScript/Tailwind components were copied from [Mike-Rp/react-bits](https://github.com/Mike-Rp/react-bits): HalftoneReveal, SplitText, CountUp, VariableProximity, and SpecularButton. Their license is retained in [`src/components/reactbits/LICENSE.md`](src/components/reactbits/LICENSE.md).
- VariableProximity uses Clash Grotesk's weight axis on the short phrase “learns fast.” The original component's Roboto Flex import was removed. Motion effects are disabled or replaced with static text when reduced motion is requested.

## Content still needed

- A resume file or URL for **View Resume**.
- A contact email address or destination for **Contact Me**.
- An About section for **More about me**.

Until these are supplied, the controls explain what is missing instead of navigating to a placeholder destination. The About, Projects, Experience, and Contact sidebar items are labels for future phases.
