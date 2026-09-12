import {defineConfig,globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// App Bridge NavMenu requires anchor children, and its script must load synchronously
// after the server-rendered API-key meta tag. Modal prop changes intentionally reset forms.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {rules:{'@next/next/no-html-link-for-pages':'off','@next/next/no-sync-scripts':'off','@next/next/no-location-assign-relative-destination':'off','react-hooks/set-state-in-effect':'off','@typescript-eslint/no-explicit-any':'off'}},
  globalIgnores(['.next/**','out/**','build/**','next-env.d.ts']),
]);
