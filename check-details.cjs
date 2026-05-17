const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));

const lcpAudit = report.audits['largest-contentful-paint-element'];
if (lcpAudit && lcpAudit.details && lcpAudit.details.items) {
  console.log('LCP Element Item:', JSON.stringify(lcpAudit.details.items[0], null, 2));
} else {
  console.log('LCP element audit not found or no items.');
}

const renderBlocking = report.audits['render-blocking-resources'];
if (renderBlocking && renderBlocking.details && renderBlocking.details.items) {
  console.log('\nRender Blocking Resources:');
  renderBlocking.details.items.forEach(item => {
    console.log(`- ${item.url} (Savings: ${item.wastedMs}ms)`);
  });
}
