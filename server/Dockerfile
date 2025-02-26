FROM oven/bun:latest

WORKDIR /app

ENV PUPPETEER_SKIP_DOWNLOAD="true"
ENV IS_DOCKER="true"
ENV DEFAULT_GUIDELINE_IDS="WCAG_2_1"

RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]
