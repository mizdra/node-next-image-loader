import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./hook.js', pathToFileURL(import.meta.filename));
