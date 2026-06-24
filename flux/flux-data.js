/* ============================================================
   Données du flux Octans
   EN LIGNE (gauche) : LLMs → MCP + automatisation
   LOCAL (droite)    : Octans { Claude Code, Codex } → éditeurs
   ============================================================ */
window.FLUX = {
  llm: [
    { id:'chatgpt', nm:'ChatGPT', c:'#10A37F', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#10A37F" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.5 18 7v6l-6 3.5L6 13V7z"/><path d="M12 3.5v6.5l6 3M12 10 6 13"/></svg>' },
    { id:'claude', nm:'Claude', c:'#E0915A', svg:'<svg viewBox="0 0 24 24" stroke="#D97757" stroke-width="1.9" stroke-linecap="round"><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7"/></svg>' },
    { id:'gemini', nm:'Gemini', c:'#1B72E8', svg:'<svg viewBox="0 0 24 24" fill="#1B72E8"><path d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10Z"/></svg>' },
    { id:'mistral', nm:'Mistral', c:'#FA520F', svg:'<svg viewBox="0 0 24 24" fill="#FA520F"><rect x="3" y="5" width="4" height="4"/><rect x="3" y="11" width="4" height="4"/><rect x="3" y="17" width="4" height="2"/><rect x="10" y="5" width="4" height="4"/><rect x="10" y="11" width="4" height="4"/><rect x="17" y="5" width="4" height="4"/></svg>' },
    { id:'perplexity', nm:'Perplexity', c:'#20808D', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#20808D" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 4v16M5 8h14M5 16h14"/></svg>' },
    { id:'copilot', nm:'Copilot', c:'#C9CFCF', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#C9CFCF" stroke-width="1.6"><ellipse cx="12" cy="13" rx="8" ry="6"/><circle cx="9.5" cy="13" r="1.1" fill="#C9CFCF"/><circle cx="14.5" cy="13" r="1.1" fill="#C9CFCF"/></svg>' },
    { id:'grok', nm:'Grok', c:'#EEF1F1', svg:'<svg viewBox="0 0 24 24" stroke="#EEF1F1" stroke-width="2" stroke-linecap="round"><path d="M6 18 18 6M10 6h8v8"/></svg>' },
    { id:'llama', nm:'Llama', c:'#0866FF', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#0866FF" stroke-width="1.8"><path d="M3 12c0-2.5 2-4.5 4.5-4.5S12 12 12 12s2-4.5 4.5-4.5S21 9.5 21 12s-2 4.5-4.5 4.5S12 12 12 12s-2 4.5-4.5 4.5S3 14.5 3 12Z"/></svg>' },
    { id:'deepseek', nm:'DeepSeek', c:'#4D6BFE', svg:'<svg viewBox="0 0 24 24" fill="#4D6BFE"><path d="M4 13c2-5 7-7 12-6-2 1-3 2-3 4 3-1 5 0 7 2-3 0-4 1-5 3-3 2-8 1-11-3Z"/></svg>' }
  ],
  mcp: [
    { id:'prod', nm:'Productivité', tools:['Notion','Linear','Google Workspace','Slack','Todoist'] },
    { id:'design', nm:'Design', tools:['Figma','Framer','Excalidraw','Canva'] },
    { id:'crm', nm:'CRM & Sales', tools:['HubSpot','Salesforce','Pipedrive','Attio'] },
    { id:'dev', nm:'Dev & DevOps', tools:['GitHub','GitLab','Docker','Sentry','Vercel'] },
    { id:'data', nm:'Data', tools:['PostgreSQL','Supabase','BigQuery','Airtable'] },
    { id:'finance', nm:'Finance', tools:['Stripe','QuickBooks','Pennylane','Brex'] },
    { id:'search', nm:'Recherche', tools:['Brave Search','Exa','Perplexity API','Tavily'] }
  ],
  // automatisation EN LIGNE cloud-only — NON connectée à Octans
  auto: [
    { id:'make', nm:'Make', sub:'cloud uniquement', c:'#6D00CC' },
    { id:'zapier', nm:'Zapier', sub:'cloud uniquement', c:'#FF4F00' },
    { id:'n8ncloud', nm:'n8n', sub:'cloud · n8n.cloud', c:'#EA4B71', svg:'<svg viewBox="0 0 24 24" fill="#EA4B71"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="7" r="2.2"/><circle cx="12" cy="17" r="2.2"/><circle cx="19" cy="12" r="2.2"/><path d="M7 12h2.8M14.2 8.2l2.6 2.6M14.2 15.8l2.6-2.6" stroke="#EA4B71" stroke-width="1.4"/></svg>' }
  ],
  // automatisation LOCALE (self-hosted) — après les agents
  localauto: [
    { id:'n8n', nm:'n8n', sub:'self-hosted · npm / Docker', c:'#EA4B71', svg:'<svg viewBox="0 0 24 24" fill="#EA4B71"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="7" r="2.2"/><circle cx="12" cy="17" r="2.2"/><circle cx="19" cy="12" r="2.2"/><path d="M7 12h2.8M14.2 8.2l2.6 2.6M14.2 15.8l2.6-2.6" stroke="#EA4B71" stroke-width="1.4"/></svg>' }
  ],
  // exécution LOCALE — encapsulée DANS Octans
  agents: [
    { id:'claudecode', nm:'Claude Code', sub:'agent principal', c:'#E0915A', svg:'<svg viewBox="0 0 24 24" stroke="#E0915A" stroke-width="2" stroke-linecap="round"><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7"/></svg>' },
    { id:'codex', nm:'Codex', sub:'renfort code', c:'#C9CFCF', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#C9CFCF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10 6 16l6 6M20 10l6 6-6 6"/></svg>' }
  ],
  editors: [
    { id:'vscode', nm:'VS Code', sub:"l'éditeur", c:'#2EA7E0', svg:'<svg viewBox="0 0 24 24" fill="#2EA7E0"><path d="M17 3 9 10.5 5 7 3 8l3.3 4L3 16l2 1 4-3.5L17 21l4-1.5V4.5L17 3Zm.3 4.7v8.6l-5.2-4.3 5.2-4.3Z"/></svg>' },
    { id:'cursor', nm:'Cursor', sub:'IDE IA', c:'#EEF1F1', svg:'<svg viewBox="0 0 24 24" fill="#EEF1F1"><path d="M5 4 19 12 5 20z" opacity=".9"/></svg>' }
  ],
  desc: {
    llm:"Les modèles de langage en ligne que vous utilisez déjà. Ils formulent, raisonnent, rédigent — mais ne touchent pas vos outils seuls.",
    mcp:"Le pont entre l'IA et vos outils réels. Chaque catégorie expose des actions concrètes (lire, créer, mettre à jour) via le protocole MCP.",
    auto:"Automatisation 100% cloud (Make, Zapier). Branche vos services en ligne — hors d'Octans, côté cloud uniquement.",
    localauto:"Automatisation auto-hébergée sur votre PC (npm / Docker). Claude Code peut l'appeler via webhook / script — ou vous la lancez en cloud (n8n.cloud).",
    octans:"Octans, c'est votre CLAUDE.md : la couche d'instruction, en local. Elle instruit Claude Code, qui exécute dans VS Code / Cursor, actionne les connecteurs MCP et peut appeler n8n (via webhook / script).",
    agents:"Les moteurs d'exécution qu'Octans pilote, en local. Claude Code mène, Codex renforce le code.",
    editors:"Votre atelier local. Le résultat atterrit directement dans votre éditeur, sur votre machine — à vous."
  }
};
