#!/usr/bin/env node
import { calculate } from './index.js';

if (!process.argv[2]) {
    console.error('❌ Missing selector argument');
    process.exit(1);
}

try {
    const specificity = calculate(process.argv[2]);
    console.log(`(${specificity.a},${specificity.b},${specificity.c})`);
} catch (e) {
    console.error(`❌ ${e.message}`);
}
