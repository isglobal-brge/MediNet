// Capture untouched Hub UI templates served by capture-hub-fixtures.py.
// Requires Playwright already installed; no dependencies or Hub database are changed.
// Start the fixture server first, then: node scripts/capture-hub-screenshots.cjs
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.argv[2] || process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = path.resolve(__dirname, '../images/v2');
const executable = process.argv[3] || process.env.CHROMIUM_EXECUTABLE;
const origin = process.env.HUB_FIXTURE_URL || 'http://127.0.0.1:8766';
(async () => {
  const browser = await chromium.launch({ headless: true, ...(executable ? { executablePath: executable } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1040 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', error => errors.push({message:error.message,url:page.url()}));
    const job = { id: 1, name: 'Demo federated screening', status: 'running', current_round: 6, total_rounds: 10, progress: 60, started_at: '2026-10-06T09:00:00Z', training_duration: 180 };
    const metrics = Array.from({length: 6}, (_, i) => ({round: i+1, accuracy: .61+i*.046, loss: .75-i*.081, precision: .60+i*.047, recall: .59+i*.049, f1: .595+i*.048, num_clients: 2, clients: 2}));
    const clients = Object.fromEntries([1,2].map(i => ['demo-'+i, {client_id:'demo-'+i,status:'training',connection_name:'Demo Hospital '+(i===1?'A':'B'),connection_ip:'192.0.2.'+(i*10),connection_port:5000,train_samples:i===1?960:720,test_samples:i===1?240:180,accuracy:i===1?.84:.83,loss:i===1?.35:.37}]));
    await context.route('**/api/**', async route => {
      const url = route.request().url();
      let response;
      if (url.includes('get-model-config/')) response={id:1,name:'Demo screening 52-64-32-1',config_json:{metadata:{model_type:'dl'},dataset:{selected_datasets:[{name:'Synthetic screening'}]}}};
      else if (url.includes('job-details')) response={success:true,job};
      else if (url.includes('get-job-metrics')) response={success:true,metrics,job,current_round:6,total_rounds:10,progress:60,job_status:'running'};
      else if (url.includes('client-status')) response={success:true,clients,is_complete:false};
      else return route.continue();
      return route.fulfill({json:response});
    });
    const open = async route => { const response=await page.goto(origin+'/'+route); if(response.status()!==200) throw Error(route+' returned '+response.status()); await page.waitForTimeout(1000); };
    const snap = async (name,fullPage=false) => {
      await page.evaluate(() => {
        document.getElementById('documentation-demo-label')?.remove();
        const label=document.createElement('div'); label.id='documentation-demo-label'; label.textContent='DOCUMENTATION DEMO · SYNTHETIC DATA · HUB 2.0.1';
        label.style.cssText='position:fixed;bottom:10px;right:14px;z-index:2147483647;background:#fff;border:1px solid #a5c8d5;border-radius:4px;color:#375361;padding:5px 9px;font:11px Arial,sans-serif;box-shadow:0 2px 5px #0001'; document.body.appendChild(label);
      });
      await page.screenshot({path:path.join(output,name+'.png'),animations:'disabled',fullPage});
    };
    await fs.mkdir(output,{recursive:true});
    await open('login/'); await snap('hub-login');
    await open('panel/'); await snap('hub-dashboard');
    await open('panel/?empty=1'); await snap('hub-dashboard-empty');
    await open('datasets/'); await page.locator('#connections-bar-toggle').click(); await snap('hub-datasets');
    await page.getByRole('button',{name:'Add Connection',exact:true}).first().click(); await page.waitForTimeout(400); await snap('hub-connection-import');
    await open('model-studio/'); await snap('hub-model-studio');
    await page.locator('#new-model-btn').click(); await page.waitForTimeout(400); await snap('hub-model-type-selection');
    await open('model-designer/');
    await page.locator('[data-layer-type="linear"]').click(); await page.locator('[data-layer-type="activation_relu"]').click();
    await page.locator('[data-layer-type="linear"]').click(); await page.locator('#param-out_features').fill('32'); await page.locator('#param-out_features').dispatchEvent('change');
    await page.locator('[data-layer-type="activation_relu"]').click(); await page.locator('[data-layer-type="linear"]').click(); await page.locator('#param-out_features').fill('1'); await page.locator('#param-out_features').dispatchEvent('change');
    await page.locator('#tab-config').click(); await page.locator('#model-name-input').fill('Synthetic screening 52-64-32-1');
    await page.locator('#loss-trigger').click(); await page.locator('#loss-popover').getByText('Binary Cross-Entropy',{exact:true}).click(); await snap('hub-sequential-designer');
    await page.locator('#dp-collapse-trigger').click(); await snap('hub-privacy-settings');
    await open('model-designer-advanced/'); await page.locator('#presets-btn').click(); await page.waitForTimeout(400); await page.locator('#presets-list').getByText('MLP Classifier',{exact:true}).click(); await page.waitForTimeout(400); await snap('hub-advanced-designer');
    await open('ml-model-designer/'); await page.locator('select').first().selectOption({label:'FedDP Random Forest (Differentially Private)'}); await snap('hub-ml-designer');
    await open('training/'); await page.locator('#job-name').fill('Demo screening — two synthetic sites'); await page.locator('[data-bs-target="#collapseTrainingParams"]').click(); await page.waitForTimeout(400); await snap('hub-training');
    await open('dashboard/'); await snap('hub-monitoring');
    await open('client-dashboard/'); await snap('hub-client-dashboard');
    await open('model-studio/?comparison=1'); await page.locator('[data-ms-tab="compare"]').click(); await page.locator('#model1').selectOption('1'); await page.locator('#model2').selectOption('2'); await snap('hub-comparison');
    // Detached2.0.1 connection status refresh calls an out-of-scope getCookie helper; keep source untouched.
    const unexpected=errors.filter(error=>!(error.message==='getCookie is not defined' && new URL(error.url).pathname==='/datasets/'));
    if(unexpected.length) throw Error('Browser errors: '+JSON.stringify(unexpected));
    if(errors.length) console.log('Known source exceptions: '+JSON.stringify(errors));
    console.log('Captured 15 Hub screenshots with synthetic fixtures; no unexpected browser exceptions. Known detached source exception: getCookie is not defined during datasets connection status refresh.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
