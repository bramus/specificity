#!/usr/bin/env node
import { calculate } from './core';

if (!process.argv[2]) {
    console.error('❌ Missing selector argument');
    process.exit(1);
}

try {
    const specificities = calculate(process.argv[2]);
    console.log(specificities.map((specificity) => specificity.toString()).join('\n'));
} catch (e) {
    console.error(`❌ ${e.message}`);
}
