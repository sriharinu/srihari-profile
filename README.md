# Sri Hari — personal portfolio

A responsive portfolio built from scratch with semantic HTML, CSS, and vanilla JavaScript. No framework, runtime dependencies, or Python environment is required. Content is based on the supplied résumé.

## Develop

Use Node.js 22.x, matching the Vercel build configuration. No package installation is needed for local development or the site build.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Refresh the page after editing.

To check the site on a phone, run:

```sh
npm run dev:network
```

Connect the phone to the same Wi-Fi as the computer, then open the printed Network URL. Keep the server running while testing. Stop any existing local preview before starting this command, since both use port 4173.

## Check and build

```sh
npm run check
npm run build
npm run preview
```

The build copies [src](./src) and [public](./public) into `dist`, ready for static hosting. The server binds to localhost by default; `--host` enables local-network access.

## Host on Vercel Hobby

This portfolio is configured as a static site in [vercel.json](./vercel.json). Vercel builds the site and serves the resulting HTML, CSS, JavaScript, portrait, and résumé. The local preview server is not used in production. No environment variables, Vercel Functions, or database are required.

The configuration is ready; creating a Vercel deployment is a separate step. Choose your personal **Hobby** account/team when deploying. Vercel describes Hobby as a plan for [personal, non-commercial projects](https://vercel.com/docs/plans/hobby).

### Deploy from this folder

Run these commands from the project folder containing this README and [vercel.json](./vercel.json):

```sh
npx vercel@latest login
npx vercel@latest --prod
```

The CLI downloads when needed. During setup, choose your Hobby account/team, create or select the portfolio project, and use `./` as the code directory. Keep the settings provided by [vercel.json](./vercel.json). The CLI prints the production URL after deployment. This approach does not require a Git repository.

For later updates, run `npx vercel@latest --prod` again from this folder. Local project-linking information is stored in `.vercel/`, which is excluded from Git. [CLI deployment reference](https://vercel.com/docs/cli/deploy).

### Deploy through Git

1. Put this website folder in its own Git repository and push it to your Git provider. Include [src](./src), [public](./public), [scripts](./scripts), [package.json](./package.json), and [vercel.json](./vercel.json). The generated `dist` folder is not committed.
2. In Vercel, choose **Add New → Project**, select your Hobby account/team, and import the repository.
3. Set **Root Directory** to the folder containing [vercel.json](./vercel.json). For a repository containing only this project, use the repository root.
4. Confirm the settings below and deploy. Future pushes to the connected production branch trigger new deployments.

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Build Command | `npm run check && npm run build` |
| Output Directory | `dist` |
| Install Command | Skipped (`installCommand` is an empty string) |
| Node.js Version | 22.x |
| Environment Variables | None |

The framework, build, install, and output settings are defined in [vercel.json](./vercel.json); the Node version is defined in [package.json](./package.json). See [Vercel’s configuration reference](https://vercel.com/docs/project-configuration/vercel-json).

### After deployment

- Open the production URL on desktop and mobile; it works without keeping the local preview running.
- Check section navigation, project detail dialogs, résumé download, and the LinkedIn links.
- Update content in [src](./src) or assets in [public](./public), then redeploy.

The site uses section anchors such as `/#experience`, so no catch-all rewrite is needed. Asset URLs such as `/assets/sri-hari-resume.pdf` resolve directly from the built output. [.vercelignore](./.vercelignore) excludes local build output and logs from CLI uploads; Vercel recreates the build remotely.

## Edit

- [src/index.html](./src/index.html): profile, experience, skills, and contact content.
- [src/styles.css](./src/styles.css): desktop, mobile, reduced-motion, and print styles.
- [src/main.js](./src/main.js): project detail dialogs, email copy action, and active navigation.
- [public/assets](./public/assets): original portrait and résumé.
- [public/assets/tools](./public/assets/tools): locally hosted SVG logos and generic concept icons used in the Skills section. Source and license details are in [NOTICE.txt](./public/assets/tools/NOTICE.txt).

The site includes keyboard-accessible native dialogs, visible focus states, a skip link, responsive layouts, and downloadable PDF résumé. It makes no analytics or third-party script requests.
