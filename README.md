node -v 16.15.0
npm -v 8.5.5

#Installation

RUN `npm install`
RUN `npm run build && serve -s -n` or `npm run build && npx serve`

RUN `npm run dev`
to run in development mode.
