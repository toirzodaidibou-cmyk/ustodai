# UstodAI — дафтари корҳо

Ҳар кадами иҷрошуда дар ин ҷо сабт мешавад. Нақшаи пурра дар [ROADMAP.md](ROADMAP.md) аст.

---

## 2026-10-19 — Кадами 1: асоси проект ва саҳифаи асосӣ

### Чӣ кор шуд
- `git init` дар `ustodAI/` иҷро шуд. Акнун ин проект репозиторияи алоҳида дорад ва аз репозиторияи `C:\Users\HP` ҷудо аст.
- Дар `web/` проекти **Next.js 16.4** сохта шуд: React 19.3, TypeScript, Tailwind v4, ESLint, Turbopack ва `cacheComponents`.
- Китобхонаҳо: `lucide-react` (иконаҳо), `clsx` ва `tailwind-merge`.
- **Системаи дизайн** (`web/src/app/globals.css`):
  - Токенҳои ранг: `bg`, `fg`, `brand`, `success`, `warning`, `danger`, `border` ва сояҳо.
  - Мавзӯи торик автоматӣ аз рӯи танзимоти система фаъол мешавад. Онро бо `data-theme` дастӣ ҳам интихоб кардан мумкин аст.
  - Аниматсияҳо: `float` ва `fade-up`. Агар корбар `prefers-reduced-motion`-ро фаъол карда бошад, аниматсияҳо хомӯш мешаванд.
  - Шрифт: **Inter** бо `cyrillic-ext`, ки ҳарфҳои тоҷикӣ (ғ ӣ қ ӯ ҳ ҷ)-ро дар бар мегирад.
- **Эмоҷиҳо**: 23 эмоҷии Microsoft Fluent Emoji 3D (MIT) дар `web/public/emoji/` ва литсензияи онҳо дар `LICENSE.txt`. Онҳо ба воситаи ҷузъи `<Emoji name="…">` бо `next/image` нишон дода мешаванд.
- **Ҷузъҳо**: `Button`, `ButtonLink`, `Logo`, `Emoji`, `SectionHeading`.
- **Саҳифаи асосӣ** (`/`), пурра ба забони тоҷикӣ:
  1. Меню (sticky, blur)
  2. Hero бо макети телефон: корти калимаи «door → дар», мнемоникаи AI, ҷумлаи мисол ва тугмаҳои баҳодиҳии FSRS
  3. Мушкил (3 корт)
  4. Чӣ тавр кор мекунад (4 қадам)
  5. Имконот (bento: FSRS, омӯзгори AI, талаффуз, мантиқ, пешрафт, Arena)
  6. Асоси илмӣ: графики схематикии қаҷхаттаи фаромӯшӣ (SVG) ва 3 тадқиқоти воқеӣ (Cepeda 2006, Roediger & Karpicke 2006, Atkinson 1975)
  7. Забонҳо: EN аввал меояд, RU навбатӣ аст, ZH ва DE дар нақшаанд
  8. CTA: «Ба зудӣ дастрас мешавад». Ҳоло бақайдгирӣ нест, бинобар ин тугма ба ягон саҳифа намебарад.
  9. Футер
- Метадата (title, description, `lang="tg"`) ва `themeColor` илова шуданд.

### Санҷиш
- `tsc --noEmit`: бе хато
- `eslint`: бе хато
- `next build`: ✓, саҳифаи `/` статикӣ prerender мешавад
- Скриншотҳо дар 1440px (мавзӯи равшан ва торик) ва 390px (мобилӣ) санҷида шуданд.

### Эзоҳҳо
- `npm audit` 5 огоҳии «high» нишон медиҳад. Ҳамаи онҳо дар `braces`, дар зинҷираи `eslint-config-next` ҳастанд, яъне танҳо дар devDependencies. Ба сайт таъсир намерасонанд. `audit fix --force` Next-ро ба версияи 14 бармегардонад, бинобар ин иҷро нашуд.
- Next.js огоҳӣ медиҳад, ки `C:\Users\HP\package-lock.json`-ро нодида гирифтааст. Ин огоҳӣ безарар аст.

### Ба кор андохтан
```bash
cd web
npm run dev     # http://localhost:3000
```

---

## 2026-10-19 — Кадами 2а: пайвастшавӣ ба пойгоҳи додаҳо (Neon)

### Чӣ кор шуд
- Корбар проекти Neon-ро сохт: `ustodai` (`blue-paper-40286615`), минтақаи **aws-eu-central-1 (Frankfurt)**, Postgres **18.6**, branch `production`.
- **Neon CLI 8.8.0** глобалӣ насб шуд (`npm i -g neon`). Корбар бо `neon login` ворид шуд (OAuth).
- Фармони `neon init -y --agent claude-code --org-id … --project-id blue-paper-40286615 --branch production --services postgres` иҷро шуд. Натиҷа:
  - `web/neon.ts`: танҳо Postgres. Branch-ҳои нави ғайриасосӣ пас аз 7 рӯз худ ба худ нест мешаванд.
  - `web/.neon`: ID-ҳои org, project ва branch. Ин файл дар `.gitignore` аст.
  - `web/.env.local`: `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` ва `NEON_BRANCH`. Ин файл дар `.gitignore` аст.
  - Китобхонаи `@neon/config` насб шуд.
  - **Плагини Neon барои Claude Code** (`neon-postgres@neon` v2.3.0, scope: user) насб шуд. Он 9 skill (neon, neon-postgres, neon-auth, …) ва MCP-сервери `https://mcp.neon.tech/mcp`-ро дар бар мегирад. MCP бо OAuth ворид мешавад, бинобар ин дар ягон файл калид нигоҳ дошта намешавад.
- `neon deploy` иҷро шуд. Натиҷа: «No changes — branch production already matches the policy».
- **Пайвастшавӣ дар код.** Мувофиқи skill-и `neon-postgres`, барои Next.js дар Vercel драйвери `pg` бо Fluid compute истифода мешавад:
  - Китобхонаҳо: `drizzle-orm`, `pg`, `@vercel/functions`, `server-only`. Дар dev: `drizzle-kit`, `@types/pg`.
  - `web/src/db/index.ts`: Pool (pooled URL, ҳадди аксар 10 пайваст), `attachDatabasePool` ва Drizzle. Дар dev як pool такрор истифода мешавад, то HMR пайвастҳои зиёдатӣ насозад.
  - `web/src/db/ssl.ts`: `sslmode=require` ба `verify-full` иваз мешавад, то санҷиши пурраи сертификат дар pg@9 ҳам боқӣ монад.
  - `web/src/db/schema.ts`: ҳоло холӣ аст. Ҷадвалҳо дар кадами 2б илова мешаванд.
  - `web/drizzle.config.ts`: миграцияҳо бо `DATABASE_URL_UNPOOLED`, яъне пайвасти мустақим, иҷро мешаванд.
  - Скриптҳо: `npm run db:generate`, `db:migrate`, `db:studio`.
  - `GET /api/health`: дархости `select now(), version(), current_database()`-ро иҷро мекунад. Бо `connection()` ҳамеша дар вақти дархост кор мекунад. Агар хато шавад, 503 бармегардонад ва тафсилоти хаторо ба корбар нишон намедиҳад.

### Санҷиш
- `tsc` ✓, `eslint` ✓, `next build` ✓. Саҳифаи `/` статикӣ аст ва `/api/health` динамикӣ (ƒ).
- `GET /api/health` → `200 {"status":"ok","database":{"connected":true,"postgres":"18.6","name":"neondb",…}}`
  - Дархости аввал ~1.2–2.5 с давом кард, чунки compute аз ҳолати scale-to-zero бедор мешуд. Дархостҳои баъдӣ ~150 мс.
- Пайвасти мустақим (unpooled) бо `pg` санҷида шуд: `current_user = neondb_owner`. Дар хости pooled `-pooler` ҳаст, дар unpooled нест.

### Эзоҳҳо
- Ҷадвалҳо ҳанӯз сохта нашудаанд, яъне ҳеҷ миграция иҷро нашудааст.

---

## 2026-10-19 — Кадами 2б: бақайдгирӣ ва воридшавӣ (Neon Auth)

Корбар роҳи **Neon Auth (Managed Better Auth)**-ро интихоб кард. Commit-и аввал сохта шуд: `2e25f74`.

### Чӣ кор шуд
- `neon.ts`: `auth: true`. `neon deploy` натиҷаи «+ Neon Auth» дод ва ба `.env.local` тағйирёбандаҳои `NEON_AUTH_BASE_URL` ва `NEON_AUTH_JWKS_URL` илова шуданд.
- `NEON_AUTH_COOKIE_SECRET` (32 байти тасодуфӣ, base64) дастӣ ба `.env.local` илова шуд. Санҷида шуд, ки `neon env pull` онро нигоҳ медорад.
- Китобхона: `@neondatabase/auth` 0.6.0-beta.
- **Сервер:**
  - `src/lib/auth/server.ts`: `createNeonAuth` ва `getCurrentUser()`. Функсия пеш аз хондани cookie `connection()`-ро даъват мекунад, то ҳангоми prerender хато надиҳад.
  - `src/app/api/auth/[...path]/route.ts`: прокси ба Neon Auth (GET, POST, PUT, DELETE, PATCH).
  - `src/proxy.ts`: `auth.middleware`. Танҳо `/app/:path*` ҳифз мешавад.
  - `src/app/auth/actions.ts`: `signUpAction`, `signInAction`, `signOutAction` (Server Actions). Санҷиши майдонҳо: ном 2–50 аломат, email, парол 8–128 аломат.
  - `src/lib/auth/errors.ts`: хатоҳо ба тоҷикӣ тарҷума мешаванд. SDK кодҳои Better Auth-ро табдил медиҳад (масалан, `INVALID_EMAIL_OR_PASSWORD` ба `invalid_credentials`), бинобар ин ҳарду шакл дастгирӣ мешаванд.
- **Саҳифаҳо:**
  - `/auth/sign-up` ва `/auth/sign-in`: тарҳи ду сутуна (форма ва панели бренд). Тугма барои нишон додани парол, ҳолати «интизорӣ» ва паёми хато ҳаст. Пас аз хато қиматҳои воридшуда нигоҳ дошта мешаванд. Агар корбар аллакай ворид бошад, ба `/app` гузаронида мешавад.
  - `/app` («Имрӯз»): саломи шахсӣ, менюи корбар ва тугмаи «Баромадан». Карт «Ҳисоби шумо тайёр аст» ҳаст. Омор 0 нишон медиҳад, чунки функсияҳои омӯзиш ҳанӯз нестанд. Саҳифа худаш ҳам сессияро месанҷад, яъне ҳифз ду қабат дорад.
  - Тугмаҳои саҳифаи асосӣ акнун ба `/auth/sign-up` ва `/auth/sign-in` мебаранд.
- PPR: саҳифаҳои `/app` ва `/auth/*` қисми статикӣ доранд ва қисми вобаста ба сессия дар `<Suspense>` бор мешавад.

### Санҷиш
- `tsc` ✓, `eslint` ✓, `next build` ✓ бе ягон огоҳӣ.
- **E2E** (Playwright-core ва Edge headless, 12 санҷиш, ҳама PASS):
  1. `/app` бе сессия → `/auth/sign-in`
  2. Пароли кӯтоҳ → «Парол бояд ақаллан 8 аломат бошад.» (email нигоҳ дошта мешавад)
  3. Бақайдгирӣ → `/app` бо «Салом, Тест!»
  4. Reload → сессия боқӣ мемонад. `GET /api/auth/get-session` корбарро бармегардонад.
  5. `/auth/sign-in` ҳангоми воридшуда → `/app`
  6. Баромадан → `/`. Баъд `/app` → `/auth/sign-in`
  7. Пароли нодуруст → «Email ё парол нодуруст аст.»
  8. Воридшавии дуруст → `/app`
  9. Email-и такрорӣ → «Ин email аллакай ба қайд гирифта шудааст. Ворид шавед.»
  10. `get-session` бе сессия → `null`
- Корбарони тестӣ (`ustodai.e2e.*@example.com`) пас аз санҷиш аз `neon_auth."user"` нест карда шуданд. Сессияҳо ҳам бо cascade нест шуданд.

### Эзоҳҳо
- Тасдиқи email ҳоло хомӯш аст. Neon барои оғоз SMTP-и умумиро (`auth@mail.myneon.app`) истифода мебарад. Барои истеҳсолот SMTP-и худамон лозим мешавад (production checklist).
- Воридшавӣ бо Google ҳанӯз пайваст нашудааст.
- Як маротиба дар лог `get-session upstream 500` дида шуд. Ин дар дақиқаҳои аввал пас аз фаъол кардани Auth рӯй дод ва дигар такрор нашуд.
