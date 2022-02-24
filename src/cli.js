#!/usr/bin/env node
import { calculate } from './index.js';

if (!process.argv[2]) {
    console.error('❌ Missing selector argument');
    process.exit(1);
}

try {
    const specificities = calculate(process.argv[2]);
    console.log(specificities.map((specificity) => `(${specificity.a},${specificity.b},${specificity.c})`).join('\n'));
} catch (e) {
    console.error(`❌ ${e.message}`);
}
