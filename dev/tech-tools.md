# Tech Tools — id reference

The **tech icon** input in the Projects dashboard accepts `tech_tools` ids as a comma-separated list.
This table maps every seeded tool to its canonical id (match any prefix to save time).

> Type the id into **Projects → New/Edit → Tech Icons (IDs)**, e.g.
> `3cd3e472-b847-4f4b-9fb4-44b911cdb45d, b75d25c5-010a-4d61-aa17-94dba39c0895`

| # | id | name | type | image (dark) | image (light) |
| --- | --- | --- | --- | --- | --- |
| 1 | `2a001d7a-89f3-4527-8406-62704d4462f5` | HTML | Main | `/tools/html.svg` | — |
| 2 | `e4472579-e200-418d-9a6e-ff8cc8abe9a9` | CSS | Main | `/tools/css.svg` | — |
| 3 | `a2c4d553-876d-4b1f-8590-9bb695fc17d9` | JavaScript | Main | `/tools/js.svg` | — |
| 4 | `e2686ee2-8afd-4064-b192-eb800086236c` | TypeScript | Main | `/tools/ts.svg` | — |
| 5 | `3cd3e472-b847-4f4b-9fb4-44b911cdb45d` | React | Main | `/tools/react.svg` | — |
| 6 | `2f8bd682-2d47-46c8-8011-8bd9c41ee12e` | Tailwind | Main | `/tools/tailwind.svg` | — |
| 7 | `4b5012f9-1680-48b1-ab97-76dbd4c51ef3` | Next.js | Main | `/tools/next.svg` | — |
| 8 | `7c4cf130-9393-4ab2-8eea-3121da20a0bd` | PostgreSQL | Main | `/tools/postgres.svg` | — |
| 9 | `854306cf-d6e7-49e2-aaca-0aa0a4e7335c` | Vite | Main | `/tools/vite.svg` | — |
| 10 | `c5b4c5f9-f939-403c-a67f-2a74c7135e1d` | Vue | Main | `/tools/vue.svg` | — |
| 11 | `46a5b1f0-3745-4d4f-8f2a-a61c5d58de8d` | Node.js | Main | `/tools/nodejs.svg` | — |
| 12 | `f0d8b6af-1836-41ef-ad42-25f6bde1a43b` | Express.js | Main | `/tools/express2.svg` | — |
| 13 | `11d5820b-43d5-43bd-9a5b-2cf460607e60` | JWT | Main | `/tools/jwt.svg` | — |
| 14 | `b75d25c5-010a-4d61-aa17-94dba39c0895` | Supabase | Main | `/tools/supabase.svg` | — |
| 15 | `2e9e63a9-47ba-4a8d-bf85-1198f49e6dd6` | Firebase | Main | `/tools/firebase.svg` | — |
| 16 | `46558a30-cfd0-4e82-8f10-d6f10fce2b1c` | Git | Main | `/tools/git.svg` | — |
| 17 | `0aa2a316-0f2e-4f6d-a2fb-7d331eecf95e` | Vercel | Main | `/tools/vercel.svg` | — |
| 18 | `57fbc4b6-f319-485d-af0e-f39286a78b5b` | SweetAlert | Main | `/tools/SweetAlert.svg` | — |
| 19 | `6692045d-7246-4dbb-b5b6-8a16cfad3da3` | Sonner | Main | `/tools/sonner.svg` | — |
| 20 | `3038af61-7296-4159-a94d-67700c38e94a` | Framer Motion | Main | `/tools/framer-white.svg` | `/tools/framer.svg` |
| 21 | `1be0236a-920e-4fe5-9d61-950fc4a86f42` | Anime.js | Main | `/tools/animejs.png` | — |
| 22 | `59803917-bcc8-4fa2-a0bb-24615a5a0372` | i18next | Main | `/tools/i18n.png` | — |
| 23 | `059af572-6e42-4028-80b3-4a79cac8096e` | Material UI | Main | `/tools/MUI.svg` | — |
| 24 | `f4ba4014-f351-45a9-ab15-7e4e8d81e0f0` | C/C++ | Other | `/tools/cpp.svg` | — |
| 25 | `6232e7d7-a187-434e-9593-db164550ddf3` | MySQL | Other | `/tools/mysql.svg` | — |
| 26 | `60133789-9411-47fe-a916-815a2e8a2f88` | PHP | Other | `/tools/php.svg` | — |
| 27 | `21a7bed0-6146-495b-901c-3bb9842c0b67` | Rust | Other | `/tools/rust-dark.svg` | `/tools/rust-light.svg` |
| 28 | `bc324786-cc0a-430c-84a5-2196260d1f81` | Railway | Other | `/tools/railway-dark.svg` | `/tools/railway-light.svg` |
| 29 | `06f451b8-7ac6-4498-b259-ecfdfebbcae3` | Tauri | Other | `/tools/tauri.svg` | — |
| 30 | `8ded38a8-4107-445b-933b-d8e500c6e6c2` | Kotlin | Other | `/tools/kotlin.svg` | — |
| 31 | `d148c636-8c23-4d18-9a19-6a8b74749bb5` | Python | Other | `/tools/python.svg` | — |
| 32 | `b3ec92a4-8c3e-4e45-884b-ddaa4eded52b` | Keras | Other | `/tools/keras.svg` | — |
| 33 | `7605d096-fa4d-4be9-a3f2-ae512c848e7c` | TensorFlow | Other | `/tools/tensorflow.svg` | — |
| 34 | `fb51b4d7-5016-46c3-b53b-079b48da2307` | Electron | Other | `/tools/electron.svg` | — |

> New tools created in the dashboard get random ids — add them to this
> table manually if you want them referenceable by id here. A tool's
> id is not shown in its form; the simplest way to find one is the
> `Tech Tools` dashboard card and the browser's network tab, or:
> `SELECT id, name FROM public.tech_tools ORDER BY sort_order;`