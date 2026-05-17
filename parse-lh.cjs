const fs = require('fs');

const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));

console.log('--- LIGHTHOUSE SCORES ---');
console.log('Performance:', Math.round(report.categories.performance.score * 100));
console.log('Accessibility:', Math.round(report.categories.accessibility.score * 100));
console.log('Best Practices:', Math.round(report.categories['best-practices'].score * 100));
console.log('SEO:', Math.round(report.categories.seo.score * 100));

console.log('\n--- PERFORMANCE METRICS ---');
const metrics = report.audits['metrics'].details.items[0];
console.log('FCP:', metrics.firstContentfulPaint, 'ms');
console.log('LCP:', metrics.largestContentfulPaint, 'ms');
console.log('TBT:', metrics.totalBlockingTime, 'ms');
console.log('CLS:', metrics.cumulativeLayoutShift);
console.log('Speed Index:', metrics.speedIndex, 'ms');

console.log('\n--- PERFORMANCE OPPORTUNITIES ---');
const audits = report.audits;
for (const key in audits) {
  const audit = audits[key];
  if (audit.score !== null && audit.score < 0.9 && audit.details && audit.details.type === 'opportunity') {
    console.log(`- ${audit.title}: Save ~${Math.round(audit.details.overallSavingsMs)}ms`);
  }
}
