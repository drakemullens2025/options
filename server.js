import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3001;

app.use(express.static(join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));

// ---------------------------------------------------------------------------
// Venture Definitions
// ---------------------------------------------------------------------------

function pick(tiers, change) {
  for (const t of tiers) if (change >= t.min) return t.text;
  return tiers[tiers.length - 1].text;
}

const PHASE1_VENTURES = [
  {
    id: 'novamind',
    name: 'NovaMind AI',
    tagline: 'Autonomous AI Sales Agents for Enterprise B2B',
    pitch: 'NovaMind builds AI agents that don\'t assist salespeople \u2014 they replace them. Their autonomous agents handle the full B2B cycle: identifying prospects, crafting personalized outreach, running product demos via video, and negotiating contract terms. In a controlled pilot with three Fortune 500 companies, NovaMind\'s agents closed deals 3.2x faster than human SDRs at one-tenth the cost. Founded by two ex-OpenAI researchers and a former CRO of Salesforce. Series A at $40M valuation. Burn rate $600K/month with 14 months of runway.',
    industryOutlook: 'The AI sales automation market is projected to hit $14B by 2028 at 34% CAGR. Enterprise adoption is accelerating as AI accuracy crosses key trust thresholds, but hallucination risks remain the top concern for procurement teams. First-mover advantage is significant \u2014 whoever solves trust at scale wins the category.',
    initialSharePrice: 40,
    basePremiumRate: 0.15,
    baseMetrics: [
      { label: 'Revenue', value: 'Pre-revenue' },
      { label: 'Burn Rate', value: '$600K/mo' },
      { label: 'Runway', value: '14 months' },
      { label: 'Pipeline Value', value: '$4.2M' },
      { label: 'Enterprise Pilots', value: '3 Fortune 500' },
      { label: 'Team Size', value: '18' },
    ],
    rounds: [
      { mean: 0.35, spread: 0.15, tiers: [
        { min: 0.30, text: 'Signed a paid pilot with a Fortune 100 enterprise client. Agent closed a $340K deal autonomously in 11 days. Tech press coverage explodes \u2014 three inbound acquisition inquiries within the week.' },
        { min: 0.15, text: 'Two enterprise prospects moved to contract negotiation after strong demo cycles. A mid-tier SaaS company signed a small paid pilot. Industry buzz building steadily.' },
        { min: 0, text: 'Demos are generating interest but enterprise procurement cycles remain slow. One Fortune 500 prospect requested a second evaluation round. Pipeline growing but no signed deals.' },
        { min: -0.10, text: 'Enterprise sales cycle dragging longer than projected. Two prospects pushed evaluations to next quarter. CRO restructuring the go-to-market approach around smaller accounts.' },
        { min: -Infinity, text: 'Key Fortune 500 prospect dropped out after their legal team flagged AI liability concerns. A second prospect ghosted. Board requests revised GTM strategy at next meeting.' },
      ]},
      { mean: -0.30, spread: 0.20, tiers: [
        { min: 0.05, text: 'Against expectations, the paid pilot delivered strong results \u2014 agent outperformed the client\'s top rep in close rate. Cautious optimism returns. Two more enterprises enter pilot discussions.' },
        { min: -0.10, text: 'Pilot results mixed \u2014 agent performed well on straightforward deals but hallucinated pricing terms on a complex multi-stakeholder negotiation. Client wants modifications before expanding.' },
        { min: -0.30, text: 'Pilot results disappointing \u2014 agent fabricated discount terms in two deals and misquoted a competitor\'s pricing. Client pauses expansion indefinitely. Lead researcher exploring other opportunities.' },
        { min: -Infinity, text: 'Pilot fails critically \u2014 agent sent unauthorized contract amendments to a client\'s procurement team. Lead researcher departs for a competitor. Emergency board meeting called. Burn rate now exceeds plan.' },
      ]},
      { mean: 0.50, spread: 0.20, tiers: [
        { min: 0.45, text: 'Major model update eliminates hallucination issues through a novel verification layer. Two Fortune 500 contracts signed ($1.2M combined ARR). Acqui-hire interest from a Big Tech company surfaces at 2x current valuation.' },
        { min: 0.20, text: 'Significant technical improvements ship \u2014 hallucination rate drops below 0.1%. One new enterprise contract signed. TechCrunch profiles the company as "one to watch." Fundraising momentum returns.' },
        { min: 0, text: 'Gradual technical recovery. A mid-market client signs a small annual contract ($180K). Team is rebuilding trust with the enterprise pipeline. Morale stabilizing.' },
        { min: -0.15, text: 'Technical fixes underway but haven\'t shipped yet. Enterprise prospects still cautious. One remaining pilot client downgrades to a smaller engagement. Fundraising conversations stall.' },
        { min: -Infinity, text: 'Despite engineering effort, product struggles to regain credibility. Key investor passes on follow-on round. Runway now under 8 months. Exploring bridge financing options.' },
      ]},
      { mean: 0.15, spread: 0.20, tiers: [
        { min: 0.25, text: 'Series B term sheet arrives at 3x the Series A valuation. A Fortune 50 company signs a $2M annual contract. NovaMind is now the clear category leader in autonomous sales \u2014 competitors are pivoting to "copilot" positioning instead.' },
        { min: 0.10, text: 'Fundraising round closes successfully. Two more mid-market contracts signed. Product-market fit solidifying in a specific vertical (cybersecurity sales). Revenue run rate approaching $5M ARR.' },
        { min: -0.05, text: 'Growth continues but at a measured pace. The market is maturing and buyers are more selective. One enterprise deal slips to next quarter. Still the technology leader but sales execution needs improvement.' },
        { min: -0.20, text: 'Funding round takes longer than expected. Lead investor imposes tighter terms. One key enterprise client churns after their internal champion leaves. Competition heating up from well-funded incumbents.' },
        { min: -Infinity, text: 'Market correction hits AI valuations broadly. Fundraising environment deteriorates. Two enterprise prospects freeze budgets. Board discusses down-round scenarios and potential acqui-hire offers.' },
      ]},
    ],
  },
  {
    id: 'maren',
    name: 'Maren Apparel',
    tagline: 'DTC Streetwear Fusing Japanese Minimalism with West Coast Skate Culture',
    pitch: 'Maren is a direct-to-consumer streetwear label blending clean Japanese silhouettes with Southern California skate influences. Founded by a former Nike senior designer, the brand has cultivated a fiercely loyal community \u2014 180K Instagram followers who buy drops within hours. $2.1M annual revenue, 42% gross margins, 18% YoY growth. Customer acquisition cost is just $18 versus a $45 industry average, because the brand is almost entirely word-of-mouth. Zero outside funding to date. The founder is now considering a modest raise to expand into physical retail.',
    industryOutlook: 'The global streetwear market reached $187B in 2025, with DTC brands capturing increasing share from legacy retailers. Customer acquisition costs in DTC are rising industry-wide, making organic brand-building \u2014 exactly what Maren has \u2014 the key differentiator. Brands with genuine community loyalty command 3-5x revenue multiples over those reliant on paid acquisition.',
    initialSharePrice: 12,
    basePremiumRate: 0.08,
    baseMetrics: [
      { label: 'Revenue', value: '$2.1M/yr' },
      { label: 'Gross Margin', value: '42%' },
      { label: 'Growth', value: '18% YoY' },
      { label: 'CAC', value: '$18' },
      { label: 'LTV', value: '$340' },
      { label: 'Instagram', value: '180K followers' },
    ],
    rounds: [
      { mean: 0.08, spread: 0.04, tiers: [
        { min: 0.08, text: 'Quarterly revenue 12% ahead of projections. A mid-tier influencer with 2M followers wore the brand unprompted, driving a 340% spike in site traffic over 48 hours. Conversion rate held steady through the surge.' },
        { min: 0.03, text: 'Steady quarter. Revenue tracking to plan. New heavyweight cotton hoodie became a quiet bestseller. Brand awareness ticking up organically \u2014 Google search volume up 15%.' },
        { min: -Infinity, text: 'Slightly soft quarter \u2014 a delayed product drop pushed some revenue into next period. No demand issue, purely a supply chain timing miss. Customer retention rate actually improved to 68%.' },
      ]},
      { mean: 0.12, spread: 0.05, tiers: [
        { min: 0.12, text: 'Secured a pop-up retail partnership with Nordstrom for a 6-week test in 4 flagship locations. Pop-up generated $145K in the first two weeks. Online conversion rate ticked up 8% from the brand exposure. Margins holding at 42%.' },
        { min: 0.05, text: 'New collection well-received \u2014 sold out 3 of 5 SKUs within 72 hours. Pop-up retail conversations progressing with two department stores. Steady, compounding growth continues.' },
        { min: -Infinity, text: 'Growth modestly below plan \u2014 a supplier delay pushed the spring drop by 3 weeks. Some customers bought competitor alternatives. Customer retention remains strong at 65%, and the delayed inventory is now arriving.' },
      ]},
      { mean: 0.10, spread: 0.04, tiers: [
        { min: 0.10, text: 'Nordstrom extends the pop-up to 15 locations after strong sell-through rates (2.8x Nordstrom\'s streetwear average). Wholesale inquiry from a Japanese distributor. Founder considering a modest $2M seed round to fund inventory for retail expansion.' },
        { min: 0.04, text: 'Pop-up performing well \u2014 4 of 4 locations profitable. Brand expanding steadily into new markets. Revenue growth consistent at 20% annualized. First wholesale account signed with a boutique chain.' },
        { min: -Infinity, text: 'Retail expansion slower than hoped \u2014 Nordstrom wants exclusivity terms the founder isn\'t comfortable with. E-commerce holds strong. Brand equity continues to build. Instagram hits 210K followers.' },
      ]},
      { mean: 0.09, spread: 0.05, tiers: [
        { min: 0.10, text: 'Seed round closed at $2M led by a fashion-focused fund. Japanese distributor deal signed \u2014 first international revenue. Annual revenue crosses $3M. Gross margins ticking up to 45% through better supplier terms and higher volume.' },
        { min: 0.04, text: 'Revenue growth steady at 22% annualized. Second pop-up partner (Bloomingdale\'s) signed for a holiday test. Instagram crosses 225K. The brand is quietly becoming the best risk-adjusted story in the portfolio.' },
        { min: -Infinity, text: 'Growth moderates slightly as the DTC apparel market softens. Holiday drop still performed well but below last year\'s sellout pace. Fundamentals remain strong \u2014 margins, retention, and brand love all intact.' },
      ]},
    ],
  },
  {
    id: 'flourish',
    name: 'Flourish Biotics',
    tagline: 'Clinically-Validated Probiotic Sparkling Beverages for Gut Health',
    pitch: 'Flourish makes probiotic sparkling beverages formulated with six clinically-studied bacterial strains shown to reduce gut inflammation markers by 31% within 14 days. Unlike competitors like Poppi and Olipop who lead with taste and add functional ingredients as marketing, Flourish leads with clinical efficacy and has engineered taste to match. Placed in 400 stores across a regional grocery chain with $3.8M in revenue. Per-store velocity is 2.4x the functional beverage category average. The gut health supplements market is $7.2B and growing \u2014 Flourish is bridging supplements and beverages. Current valuation: $22M.',
    industryOutlook: 'The functional beverages market is growing at 12% annually with gut health the fastest subsegment. However, the space is getting crowded fast \u2014 major CPG companies (PepsiCo, Coca-Cola) are launching or acquiring probiotic lines. Clinical differentiation is the moat: brands without published efficacy data are increasingly commoditized. Shelf space battles with big CPG are the existential risk.',
    initialSharePrice: 22,
    basePremiumRate: 0.13,
    baseMetrics: [
      { label: 'Revenue', value: '$3.8M/yr' },
      { label: 'Gross Margin', value: '58%' },
      { label: 'Growth', value: '45% YoY' },
      { label: 'Store Count', value: '400' },
      { label: 'Velocity', value: '2.4x category avg' },
      { label: 'Clinical Studies', value: '2 published, 1 in progress' },
    ],
    rounds: [
      { mean: 0.18, spread: 0.08, tiers: [
        { min: 0.18, text: 'Expanded to 1,200 stores across three regional chains. Velocity data holds at 2.3x category average even at scale \u2014 unusual for a brand expanding this fast. Third clinical study (on IBS symptom relief) shows promising interim results. A major retail buyer calls Flourish "the most compelling new brand in functional beverages."' },
        { min: 0.08, text: 'Store count growing to 700 across two chains. Velocity data encouraging at 2.0x but showing slight dilution as distribution expands beyond core markets. Category competition intensifying \u2014 three new probiotic brands launched this quarter.' },
        { min: -Infinity, text: 'Expansion pace slower than planned \u2014 a target grocery chain delayed onboarding by two months. Shelf space negotiations tougher as PepsiCo\'s new probiotic line is taking priority placement. Core stores still performing well.' },
      ]},
      { mean: 0.05, spread: 0.10, tiers: [
        { min: 0.12, text: 'Defied expectations \u2014 a gastroenterologist\'s TikTok review goes viral (4.2M views), calling Flourish "the only functional beverage I actually recommend to patients." Sales surge 40% in two weeks. Third clinical study publishes with strong results.' },
        { min: 0, text: 'Growth moderates as expected. A major CPG company launches a competing probiotic line at 30% lower price points but without clinical data. Some shelf space pressure, but Flourish\'s velocity holds in stores where both are stocked.' },
        { min: -0.10, text: 'CPG competitor launches aggressively with heavy trade promotion spending. Lost 80 placements in one chain. Flourish responds with in-store sampling program, but margins compressed by 4 points from promotional activity.' },
        { min: -Infinity, text: 'Two major CPG probiotic launches in the same month undercut on price. Lost placement in one entire regional chain (200 stores). Margins compressed from defensive promotional spending. Board debates strategic pivot to DTC subscription.' },
      ]},
      { mean: -0.15, spread: 0.10, tiers: [
        { min: 0.05, text: 'Surprising resilience \u2014 DTC subscription pilot launched and hit 4,000 subscribers in 6 weeks at 85% retention. Clinical differentiation holding against CPG competitors in blind taste + efficacy tests. E-commerce now 20% of revenue.' },
        { min: -0.08, text: 'Lost some shelf placement but retained core high-performing stores. Margins compressed from promotional activity. Subscription model pilot showing early promise with 2,000 subscribers. Exploring pharma partnerships for clinical IP.' },
        { min: -0.20, text: 'Retail presence shrinking \u2014 down to 600 stores from peak. Cash burn higher than planned from promotional spending. Subscription pivot generating early revenue ($40K/mo) but not enough to offset retail decline. Fundraising to extend runway.' },
        { min: -Infinity, text: 'Lost another major chain. Retail presence halved from peak. Cash burn critical. Emergency pivot to DTC subscription and potential licensing of clinical IP to a pharma company. Exploring strategic acquisition offers.' },
      ]},
      { mean: -0.05, spread: 0.15, tiers: [
        { min: 0.10, text: 'Subscription model breaks out \u2014 12,000 subscribers at $45/mo with 82% retention. A pharma company offers $3M to license Flourish\'s clinical IP for a prescription probiotic line. The pivot is working. Investors re-engage.' },
        { min: 0, text: 'Mixed signals. Subscription growing slowly to 6,000 subscribers. Retail stabilizing at remaining stores. The clinical IP licensing discussions are progressing but slowly. Cash runway extended through a small bridge round.' },
        { min: -0.10, text: 'Subscription growth slower than modeled \u2014 3,500 subscribers, below the 5,000 target. Remaining retail locations holding but not growing. Company is surviving but the growth narrative has stalled. Exploring strategic options.' },
        { min: -Infinity, text: 'Subscription churn higher than expected. Two more retail chains drop the product. A major CPG company launches a clinical-grade probiotic at half the price. Board receives a lowball acquisition offer and debates whether to accept.' },
      ]},
    ],
  },
];

const PHASE2_VENTURES = [
  {
    id: 'terraform',
    name: 'Terraform Carbon',
    tagline: 'Modular Direct Air Capture Units with Patented Low-Energy Sorbent',
    pitch: 'Terraform Carbon is building shipping-container-sized machines that pull CO\u2082 directly from ambient air using a patented sorbent material that cuts energy costs by 40% versus existing approaches \u2014 potentially making carbon removal viable at $150/ton (versus $400-600/ton for competitors). Three MIT chemical engineers with $1.2M in DOE grant funding and 18 months of runway. Pre-revenue, but the $50B carbon removal market is materializing as corporate net-zero deadlines approach. If the patent holds, Terraform could be the low-cost leader in the category.',
    industryOutlook: 'The voluntary carbon removal market is projected to reach $50B by 2030, driven by corporate net-zero commitments and government subsidies (IRA credits, EU ETS). Technology risk is high \u2014 most DAC startups have failed to achieve economic viability. But winners will be extraordinarily valuable. Patent protection and cost-per-ton are the two metrics that matter.',
    initialSharePrice: 18,
    basePremiumRate: 0.18,
    baseMetrics: [
      { label: 'Revenue', value: 'Pre-revenue' },
      { label: 'Grant Funding', value: '$1.2M DOE' },
      { label: 'Runway', value: '18 months' },
      { label: 'Target Cost', value: '$150/ton CO\u2082' },
      { label: 'Patent Status', value: 'Provisional filed' },
      { label: 'Team Size', value: '3' },
    ],
    rounds: [
      { mean: -0.20, spread: 0.15, tiers: [
        { min: 0, text: 'Surprise upside \u2014 USPTO fast-tracked the patent review after the DOE flagged it as "critical energy technology." A $200M climate tech fund reached out for preliminary diligence. Lab results on the sorbent\'s 10,000-cycle durability test came back positive.' },
        { min: -0.15, text: 'Patent review delayed by USPTO backlog \u2014 expected timeline pushed 6 months. A competitor at Stanford published a paper showing a different sorbent approach with similar efficiency claims. Investor interest cools while the team awaits IP clarity.' },
        { min: -Infinity, text: 'Patent challenge filed by a well-funded competitor claiming prior art. Legal costs draining limited runway. Grant funding disbursement delayed by DOE administrative review. Team under significant stress \u2014 one engineer takes a leave of absence.' },
      ]},
      { mean: 0.40, spread: 0.20, tiers: [
        { min: 0.40, text: 'Patent granted with broad claims \u2014 covers both the sorbent and the manufacturing process. DOE announces a $500M carbon removal credit purchase program, and Terraform is one of 12 pre-qualified vendors. Two blue-chip VCs compete for lead position on the Series A.' },
        { min: 0.15, text: 'Patent office signals favorable review \u2014 no objections raised in preliminary assessment. Government policy environment strengthening with new bipartisan carbon removal bill introduced. One climate-focused VC opens term sheet discussions.' },
        { min: 0, text: 'Patent progress incremental \u2014 office actions being addressed but nothing definitive. Policy environment supportive but slow-moving. Team continues lab work on manufacturing scale-up. Moderate investor interest.' },
        { min: -Infinity, text: 'Patent process stalls \u2014 examiner raised new objections requiring additional technical disclosure. Congressional carbon removal bill fails to advance. One of the three engineers accepts a faculty position. Runway concerns mounting.' },
      ]},
      { mean: 0.30, spread: 0.15, tiers: [
        { min: 0.30, text: 'First pilot unit deployed at a cement plant in Texas. Performance data validates patent claims \u2014 actual cost hits $162/ton, close to the $150 target. Two corporate buyers (an airline and a cement manufacturer) sign LOIs for $8M in combined carbon credit purchases over 3 years.' },
        { min: 0.10, text: 'Pilot unit built and running in controlled conditions. Early performance data encouraging \u2014 cost per ton tracking at $185, within striking distance of target. One corporate buyer begins due diligence on a multi-year credit purchase agreement.' },
        { min: 0, text: 'Pilot unit encounters calibration issues during initial testing \u2014 fixable but adding 2 months to timeline. Cost projections hold in theory but need real-world validation. Market watching closely.' },
        { min: -Infinity, text: 'Pilot unit significantly underperforms lab results \u2014 energy consumption 25% higher in field conditions, pushing cost to $240/ton. Investors concerned about the gap between lab and deployment. Cost projections revised upward. Exploring design modifications.' },
      ]},
      { mean: 0.20, spread: 0.18, tiers: [
        { min: 0.25, text: 'Second pilot unit deployed with design improvements \u2014 hitting $158/ton. DOE purchase program allocates first $40M tranche to qualified vendors including Terraform. Series A oversubscribed at 4x. Manufacturing partner identified for scale production.' },
        { min: 0.08, text: 'Pilot unit optimization brings cost to $175/ton. One corporate credit buyer converts LOI to binding contract ($2.5M over 2 years). Series A discussions progressing with two climate-focused funds.' },
        { min: -0.05, text: 'Pilot unit running but cost still above target at $195/ton. Engineering team iterating on sorbent regeneration cycle. Market patient but timeline pressure mounting. One LOI holder requests updated performance data before committing.' },
        { min: -Infinity, text: 'Second pilot unit delayed by supply chain issues for a critical component. Cost projections revised to $220/ton. DOE program timeline slips. One corporate buyer withdraws LOI citing "technology readiness concerns." Runway tightening.' },
      ]},
      { mean: 0.25, spread: 0.20, tiers: [
        { min: 0.30, text: 'Breakthrough: manufacturing optimization drops cost to $140/ton \u2014 below target. DOE signs $15M multi-year purchase commitment. Three corporate buyers in pipeline. A major energy company proposes a joint venture for global deployment. Terraform is now valued as a category-defining climate company.' },
        { min: 0.10, text: 'Manufacturing scale-up progressing. Cost trajectory on track to hit $155/ton at scale. Second corporate contract signed. Government signals expanded carbon removal credits in upcoming budget. Series A closes successfully.' },
        { min: -0.05, text: 'Scale-up slower than hoped \u2014 manufacturing yields inconsistent. Cost holding at $175/ton. Market still supportive but competitors are catching up. One rival publishes comparable cost data. The window of differentiation is narrowing.' },
        { min: -Infinity, text: 'Manufacturing scale-up hits a wall \u2014 sorbent degradation faster at production volumes than in lab. Cost projections blown out to $250/ton. Key competitor announces $160/ton achievement. Strategic review of the entire business model underway.' },
      ]},
    ],
  },
  {
    id: 'saga',
    name: 'Saga Learning',
    tagline: 'AI Tutoring Platform That Actually Moves Standardized Test Scores',
    pitch: 'Saga is an AI-powered tutoring platform for high school math and science that doesn\'t just engage students \u2014 it measurably improves outcomes. Students using Saga improve standardized test scores by 18% on average, with the largest gains among bottom-quartile students. 45,000 MAU, $1.8M ARR, 92% month-over-month retention. Growth is entirely organic: parents tell other parents. No paid marketing spend. Two VC-backed competitors have entered the space but neither has published outcomes data. NPS of 72 (vs. industry average of 31). Current valuation: $15M.',
    industryOutlook: 'The K-12 AI tutoring market is expected to reach $8B by 2027. School district procurement cycles are long (12-18 months), but once adopted, switching costs are extremely high. Published outcomes data is becoming the key differentiator \u2014 regulators and parents increasingly demand proof of efficacy. Companies with rigorous evidence have a structural advantage in institutional sales.',
    initialSharePrice: 15,
    basePremiumRate: 0.08,
    baseMetrics: [
      { label: 'ARR', value: '$1.8M' },
      { label: 'MAU', value: '45,000' },
      { label: 'Retention', value: '92% M/M' },
      { label: 'Score Improvement', value: '+18% avg' },
      { label: 'CAC', value: '$12 (organic)' },
      { label: 'NPS', value: '72' },
    ],
    rounds: [
      { mean: 0.06, spread: 0.03, tiers: [
        { min: 0.06, text: 'MAU grows to 52,000. One of the two VC-backed competitors folds after burning through cash on paid acquisition \u2014 their users had 15% retention vs. Saga\'s 92%. Saga quietly picks up 3,000 churned users. ARR ticks to $2.0M.' },
        { min: 0.02, text: 'Modest but consistent user growth to 48,000 MAU. Retention holds at 92%. Third-party study confirms the 18% score improvement holds across diverse demographics. No drama, no headlines \u2014 just compounding.' },
        { min: -Infinity, text: 'Growth dips slightly to 43,500 MAU as the remaining competitor runs an aggressive free-trial promotion. Saga\'s retention holds rock-solid \u2014 users aren\'t leaving, new acquisition just slowed. NPS climbs to 74.' },
      ]},
      { mean: 0.10, spread: 0.04, tiers: [
        { min: 0.10, text: 'Partnership with the Ohio Department of Education for a pilot in 30 public schools serving 12,000 students. First institutional validation \u2014 Saga\'s outcomes data was the deciding factor over two competing bids. ARR reaches $2.3M.' },
        { min: 0.04, text: 'Conversations with two state education departments progressing \u2014 both requesting formal proposals. User growth accelerating to 55,000 MAU. A prominent education researcher publishes a positive independent review.' },
        { min: -Infinity, text: 'State education pilot delayed by procurement bureaucracy \u2014 a 6-month timeline stretched to 12. Consumer growth remains the primary driver. MAU at 50,000. Team frustrated by institutional pace but fundamentals strong.' },
      ]},
      { mean: 0.15, spread: 0.05, tiers: [
        { min: 0.15, text: 'Ohio pilot results published: Saga students outperformed control group by 22%. Department recommends statewide rollout (300,000 students). California and Texas education departments inquire. ARR jumps to $3.2M. Multiple VCs competing for Series A lead.' },
        { min: 0.07, text: 'Pilot data strongly positive \u2014 15% improvement over control group. State considering expanded rollout to 100 schools. Second state enters formal evaluation. ARR climbing steadily past $2.7M.' },
        { min: 0, text: 'Pilot shows moderate positive results (10% improvement) \u2014 good but not the blockbuster the state hoped for. Expansion discussions continue at a cautious pace. Consumer growth holds. ARR at $2.4M.' },
        { min: -Infinity, text: 'Pilot results inconclusive due to implementation inconsistencies at several schools. State delays expansion decision pending a second semester of data. Consumer business holds steady. ARR at $2.2M.' },
      ]},
      { mean: 0.12, spread: 0.05, tiers: [
        { min: 0.12, text: 'Ohio signs a statewide contract \u2014 Saga will be offered in all public high schools (2,200 schools, 850K students). Second state (Colorado) begins formal pilot. ARR crosses $4M. The remaining VC-backed competitor pivots away from K-12 entirely.' },
        { min: 0.06, text: 'Ohio expands pilot to 120 schools. Two additional states enter procurement discussions. Consumer MAU hits 68K. ARR at $3.5M. Word-of-mouth remains the primary growth driver \u2014 CAC still under $15.' },
        { min: 0, text: 'Ohio expansion delayed by state budget cycle \u2014 funding allocated but disbursement timeline unclear. Consumer growth continues at steady pace. ARR at $3.0M. Team managing growth with existing resources.' },
        { min: -Infinity, text: 'Ohio superintendent who championed Saga leaves for a new role. Expansion momentum pauses while new leadership evaluates existing vendor contracts. Consumer side holds steady. ARR at $2.8M.' },
      ]},
      { mean: 0.16, spread: 0.06, tiers: [
        { min: 0.16, text: 'Series A closes at $12M led by a top-tier EdTech fund. Four states now in pipeline. Published outcomes study featured in Education Week. ARR at $5.2M. Saga is now the gold standard for evidence-based AI tutoring \u2014 a category of one.' },
        { min: 0.08, text: 'Series A progressing with strong investor interest. Third state signs pilot agreement. MAU crosses 80K. A major textbook publisher proposes a content partnership. ARR at $4.5M. Growth accelerating.' },
        { min: 0, text: 'Series A fundraising in process. Institutional sales cycle remains long but pipeline is strong. Consumer growth steady. ARR at $3.8M. The company is healthy but hasn\'t yet broken through to hypergrowth.' },
        { min: -Infinity, text: 'Series A timeline stretches as EdTech funding environment tightens. One state drops Saga from consideration after budget cuts. Consumer growth slows slightly. ARR at $3.2M. Solid fundamentals but market headwinds.' },
      ]},
    ],
  },
  {
    id: 'hearth',
    name: 'Hearth Kitchens',
    tagline: 'AI-Optimized Ghost Kitchen Network Running Six Virtual Restaurant Brands',
    pitch: 'Hearth operates ghost kitchens across four cities, running six virtual restaurant brands from each location. What makes Hearth different: proprietary demand-prediction AI that analyzes neighborhood demographics, weather, local events, and time-of-day patterns to dynamically optimize menus, pricing, and prep volumes. Results: 30% less food waste and 22% higher average order values versus industry benchmarks. Revenue $5.2M annually at 8% net margins. The model depends on lease economics and delivery platform commission rates \u2014 both of which are shifting. Current valuation: $25M.',
    industryOutlook: 'The ghost kitchen market peaked in hype during 2021-22 and has since rationalized \u2014 60% of pure-play ghost kitchens launched in that period have closed. Winners are emerging: those with proprietary technology and multi-brand strategies. Delivery platform commission rates (currently 25-30%) remain the critical variable. Platforms are signaling further increases, which could break thin-margin operators.',
    initialSharePrice: 25,
    basePremiumRate: 0.13,
    baseMetrics: [
      { label: 'Revenue', value: '$5.2M/yr' },
      { label: 'Net Margin', value: '8%' },
      { label: 'Locations', value: '12 across 4 cities' },
      { label: 'Virtual Brands', value: '6 per location' },
      { label: 'Food Waste', value: '-30% vs industry' },
      { label: 'Avg Order Value', value: '+22% vs industry' },
    ],
    rounds: [
      { mean: 0.12, spread: 0.06, tiers: [
        { min: 0.12, text: 'Expanded to two new cities (Austin and Nashville). Demand-prediction AI continues to outperform \u2014 new locations hit profitability in 6 weeks vs. industry average of 16. Food waste down to 33% below industry. Gross margins improved 2 points through AI-optimized purchasing.' },
        { min: 0.04, text: 'Expansion underway in one new city. Early data from demand-prediction model encouraging \u2014 customer repeat rates 40% higher than industry average. Operations stabilizing. Net margins holding at 8%.' },
        { min: -Infinity, text: 'New city expansion hits logistical snags \u2014 local permitting delays pushed launch by 6 weeks. Existing locations performing at plan. Team using downtime to refine the prediction model. No immediate concern but timeline slipped.' },
      ]},
      { mean: -0.20, spread: 0.15, tiers: [
        { min: 0, text: 'Dodged a bullet \u2014 renegotiated delivery platform terms by threatening to build proprietary delivery in-house. Commission rate held flat while competitors saw increases. AI model adapted menus to offset rising food costs. Operations lean and efficient.' },
        { min: -0.15, text: 'Major delivery platform raises commission rates by 4 percentage points to 29%. Two locations now cash-flow negative. Lease renewal in the original city comes in 25% higher than expected. Net margins compressed to 3%.' },
        { min: -Infinity, text: 'Double hit: delivery platform commissions spike to 31% AND key lease renewals come in 35% higher. Three of twelve locations now cash-flow negative. Emergency cost review underway. Net margins turn negative for the quarter. Board debates closing underperforming sites.' },
      ]},
      { mean: 0.08, spread: 0.10, tiers: [
        { min: 0.12, text: 'Successfully renegotiated delivery terms by partnering with a smaller platform at 22% commission. Closed 2 unprofitable locations but remaining 10 are stronger. Exploring licensing the demand-prediction AI to other kitchen operators \u2014 three LOIs signed at $15K/month each.' },
        { min: 0, text: 'Stabilizing after the margin squeeze. Closed one underperforming location, renegotiated two leases. Net margins recovering to 5%. The demand-prediction IP is attracting interest from restaurant chains exploring their own ghost kitchen strategies.' },
        { min: -0.08, text: 'Restructuring ongoing. Two locations closed, one lease renegotiated. Margins still under pressure at 2% net. Team executing a credible turnaround plan focused on the highest-performing locations and potential software licensing.' },
        { min: -Infinity, text: 'Restructuring stalls as another location\'s lease comes due at unfavorable terms. Now operating 8 locations, down from 12. The business model faces existential questions about unit economics. Exploring outright pivot to software licensing.' },
      ]},
      { mean: 0.10, spread: 0.12, tiers: [
        { min: 0.15, text: 'Software licensing takes off \u2014 signed 8 restaurant chains at $12K/month each for the demand-prediction AI. SaaS revenue now exceeds kitchen operations revenue. Investors excited about the pivot to a software company with proven unit economics.' },
        { min: 0.02, text: 'Three more software licensing deals signed. Kitchen operations stable at 9 locations with positive margins. The hybrid model (kitchens + software) is finding product-market fit. Revenue diversification reducing risk profile.' },
        { min: -0.08, text: 'Software licensing interest is there but sales cycles are longer than expected. Restaurant chains want 90-day trials before committing. Kitchen operations holding steady. The business is stable but the breakout moment hasn\'t arrived.' },
        { min: -Infinity, text: 'A major delivery platform launches its own demand-prediction tool, undercutting Hearth\'s licensing pitch. Two prospective clients pause discussions. Kitchen margins compressed further by a food cost spike. The competitive moat is narrowing.' },
      ]},
      { mean: 0.12, spread: 0.15, tiers: [
        { min: 0.18, text: 'A national restaurant group acquires exclusive enterprise license for $1.8M/year. Total SaaS ARR crosses $2M. Kitchen operations profitable at all remaining sites. Hearth is now valued primarily as an AI/software company. Strategic acquisition interest from a foodtech platform.' },
        { min: 0.05, text: 'Software revenue growing steadily \u2014 12 clients, $1.2M ARR. Kitchen operations stabilized as a proving ground and demo environment for the AI. Fundraising discussions for a dedicated SaaS-focused round begin.' },
        { min: -0.05, text: 'Software pipeline growing but conversion slower than hoped. Two large prospects in final negotiation. Kitchen profitability holding. The company is viable but hasn\'t yet proven it can scale the software independently of kitchens.' },
        { min: -Infinity, text: 'Enterprise software sales stall as restaurant industry enters a spending freeze. Two kitchen locations become unprofitable again due to rising delivery costs. The company faces a cash crunch and explores emergency fundraising or acquisition.' },
      ]},
    ],
  },
];

// ---------------------------------------------------------------------------
// Dynamic Metrics (computed from share price trajectory)
// ---------------------------------------------------------------------------

function computeMetrics(id, price, initial) {
  const r = price / initial;
  switch (id) {
    case 'novamind': return [
      { label: 'Revenue', value: r > 1.15 ? `$${Math.round(r * 140)}K MRR` : 'Pre-revenue' },
      { label: 'Burn Rate', value: `$${Math.round(580 + (r > 1 ? (r - 1) * 300 : (1 - r) * -50))}K/mo` },
      { label: 'Runway', value: `${Math.max(3, Math.round(14 * Math.min(r, 1.8)))} months` },
      { label: 'Pipeline Value', value: `$${(r * 4.2).toFixed(1)}M` },
      { label: 'Enterprise Pilots', value: r > 1.3 ? `${Math.floor(r * 3)} active` : r > 1.1 ? '2 in progress' : r > 0.85 ? '1 in discussion' : 'Stalled' },
      { label: 'Team Size', value: `${Math.round(18 * Math.max(0.65, Math.min(r, 1.4)))}` },
    ];
    case 'maren': return [
      { label: 'Revenue', value: `$${(2.1 * r).toFixed(1)}M/yr` },
      { label: 'Gross Margin', value: `${Math.round(42 + (r - 1) * 10)}%` },
      { label: 'Growth', value: `${Math.round(18 * r)}% YoY` },
      { label: 'CAC', value: `$${Math.round(18 / Math.max(r, 0.7))}` },
      { label: 'LTV', value: `$${Math.round(340 * r)}` },
      { label: 'Instagram', value: `${Math.round(180 * Math.max(r, 0.9))}K` },
    ];
    case 'flourish': return [
      { label: 'Revenue', value: `$${(3.8 * r).toFixed(1)}M/yr` },
      { label: 'Gross Margin', value: `${Math.round(58 + (r - 1) * 15)}%` },
      { label: 'Growth', value: `${Math.max(0, Math.round(45 * r - 10))}% YoY` },
      { label: 'Store Count', value: `${Math.round(400 * Math.max(0.4, r))}` },
      { label: 'Velocity', value: `${(2.4 * Math.min(r, 1.3)).toFixed(1)}x category` },
      { label: 'Clinical Studies', value: r > 1.1 ? '3 published' : '2 published' },
    ];
    case 'terraform': return [
      { label: 'Revenue', value: r > 1.4 ? `$${Math.round(r * 800)}K (credits)` : 'Pre-revenue' },
      { label: 'Grant Funding', value: `$${(1.2 * Math.max(0.3, 1 - (1 - r) * 0.5)).toFixed(1)}M remaining` },
      { label: 'Runway', value: `${Math.max(3, Math.round(18 * Math.min(r, 2)))} months` },
      { label: 'Actual Cost', value: r > 1.3 ? `$${Math.round(200 - r * 30)}/ton` : '$150/ton (target)' },
      { label: 'Patent Status', value: r > 1.2 ? 'Granted' : r > 0.9 ? 'Under review' : 'Challenged' },
      { label: 'Team Size', value: `${Math.max(2, Math.round(3 * Math.min(r, 2)))}` },
    ];
    case 'saga': return [
      { label: 'ARR', value: `$${(1.8 * r).toFixed(1)}M` },
      { label: 'MAU', value: `${Math.round(45 * r)}K` },
      { label: 'Retention', value: `${Math.min(95, Math.round(92 + (r - 1) * 8))}% M/M` },
      { label: 'Score Improvement', value: `+${Math.round(18 * Math.min(r, 1.3))}% avg` },
      { label: 'CAC', value: `$${Math.round(12 / Math.max(r, 0.7))}` },
      { label: 'NPS', value: `${Math.round(72 * Math.min(r, 1.15))}` },
    ];
    case 'hearth': return [
      { label: 'Revenue', value: `$${(5.2 * r).toFixed(1)}M/yr` },
      { label: 'Net Margin', value: `${Math.max(-5, Math.round(8 + (r - 1) * 20))}%` },
      { label: 'Locations', value: `${Math.max(6, Math.round(12 * Math.max(0.6, r)))}` },
      { label: 'Virtual Brands', value: '6 per location' },
      { label: 'Food Waste', value: `-${Math.round(30 * Math.min(r, 1.2))}% vs industry` },
      { label: 'Avg Order Value', value: `+${Math.round(22 * Math.min(r, 1.3))}% vs industry` },
    ];
    default: return [];
  }
}

// ---------------------------------------------------------------------------
// Game State
// ---------------------------------------------------------------------------

const rooms = new Map();

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code;
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function makeVentures(defs) {
  return defs.map(d => ({
    ...d,
    sharePrice: d.initialSharePrice,
    strikePrice: d.initialSharePrice,
    priceHistory: [d.initialSharePrice],
    currentPremium: 0,
    metrics: d.baseMetrics,
    roundNarrative: null,
  }));
}

function createRoom(instructorSocket) {
  const code = generateCode();
  const room = {
    code,
    instructor: instructorSocket.id,
    phase: 1,
    round: 0,
    status: 'lobby',
    ventures: makeVentures(PHASE1_VENTURES),
    players: new Map(),
    playersByName: new Map(),
    roundDemand: new Map(),     // ventureId -> { buys, sells }
    roundEndTime: null,
  };
  rooms.set(code, room);
  return room;
}

function addPlayer(room, socketId, name) {
  if (room.playersByName.has(name)) {
    const existing = room.playersByName.get(name);
    room.players.delete(existing.socketId);
    existing.socketId = socketId;
    room.players.set(socketId, existing);
    return existing;
  }
  const player = {
    socketId, name,
    cash: 100_000,
    options: [],    // { ventureId, contracts, premiumPerContract, strikePrice, round }
    equity: [],     // { ventureId, amount, shares, purchasePrice, round }
    history: [],
  };
  room.players.set(socketId, player);
  room.playersByName.set(name, player);
  return player;
}

// ---------------------------------------------------------------------------
// Option Premium Calculation
// ---------------------------------------------------------------------------

function maxRounds(phase) { return phase === 1 ? 4 : 5; }

function calculatePremium(venture, room) {
  const mr = maxRounds(room.phase);
  // Intrinsic value: what the option is worth if exercised now
  const intrinsic = Math.max(0, venture.sharePrice - venture.strikePrice) * 100;

  // Time value: decays as rounds pass (sqrt for convexity)
  const roundsLeft = Math.max(0, mr - room.round + (room.status === 'playing' ? 1 : 0));
  const timeFactor = Math.sqrt(roundsLeft / mr);
  const timeValue = venture.basePremiumRate * venture.strikePrice * 100 * timeFactor;

  const base = intrinsic + timeValue;

  // Demand adjustment (intra-round, scales to class size)
  const demand = room.roundDemand.get(venture.id) || { buys: 0, sells: 0 };
  const netDemand = demand.buys - demand.sells;
  const playerCount = Math.max(3, room.players.size);
  const demandMult = 1 + (netDemand * 0.04) / Math.sqrt(playerCount);

  return Math.max(1, Math.round(base * Math.max(0.5, demandMult)));
}

function updateAllPremiums(room) {
  for (const v of room.ventures) {
    v.currentPremium = calculatePremium(v, room);
  }
}

// ---------------------------------------------------------------------------
// Round Resolution (inter-round: random share price movement)
// ---------------------------------------------------------------------------

function generateOutcome(roundConfig) {
  const change = roundConfig.mean + (Math.random() * 2 - 1) * roundConfig.spread;
  return Math.max(-0.55, Math.min(0.75, change));
}

function resolveRound(room) {
  const roundIndex = room.round - 1;
  const results = [];

  for (const venture of room.ventures) {
    const roundCfg = venture.rounds[roundIndex];
    if (!roundCfg) continue;

    const change = generateOutcome(roundCfg);
    const oldPrice = venture.sharePrice;
    venture.sharePrice = Math.round(oldPrice * (1 + change) * 100) / 100;
    venture.priceHistory.push(venture.sharePrice);

    const narrative = pick(roundCfg.tiers, change);
    venture.roundNarrative = narrative;
    venture.metrics = computeMetrics(venture.id, venture.sharePrice, venture.initialSharePrice);

    results.push({
      ventureId: venture.id,
      name: venture.name,
      change: Math.round(change * 1000) / 10,
      oldPrice, newPrice: venture.sharePrice,
      narrative,
      metrics: venture.metrics,
    });
  }

  // Recalculate premiums with new prices
  room.roundDemand = new Map();
  updateAllPremiums(room);

  return results;
}

// ---------------------------------------------------------------------------
// Phase End — Exercise or Expire Options
// ---------------------------------------------------------------------------

function resolvePhaseEnd(room) {
  const playerResults = new Map();

  for (const [sid, player] of room.players) {
    let totalPayout = 0;
    const details = [];

    for (const opt of player.options) {
      const venture = room.ventures.find(v => v.id === opt.ventureId);
      if (!venture) continue;

      const intrinsic = Math.max(0, venture.sharePrice - opt.strikePrice) * 100 * opt.contracts;
      const cost = opt.premiumPerContract * opt.contracts;

      if (intrinsic > 0) {
        totalPayout += intrinsic;
        details.push({
          ventureId: opt.ventureId, name: venture.name,
          contracts: opt.contracts, cost, payout: intrinsic,
          action: 'exercised',
        });
      } else {
        details.push({
          ventureId: opt.ventureId, name: venture.name,
          contracts: opt.contracts, cost, payout: 0,
          action: 'expired',
        });
      }

      player.history.push({
        round: room.round, phase: room.phase,
        action: intrinsic > 0 ? 'option_exercised' : 'option_expired',
        ventureId: opt.ventureId, contracts: opt.contracts,
        cost, payout: intrinsic,
      });
    }

    // Resolve equity
    let equityValue = 0;
    const equityDetails = [];
    for (const eq of player.equity) {
      const venture = room.ventures.find(v => v.id === eq.ventureId);
      if (!venture) continue;
      const currentVal = Math.round(eq.shares * venture.sharePrice * 100) / 100;
      equityValue += currentVal;
      equityDetails.push({
        ventureId: eq.ventureId, name: venture.name,
        shares: eq.shares, invested: eq.amount, value: Math.round(currentVal),
      });
    }

    player.cash += totalPayout + equityValue;
    player.options = [];
    player.equity = [];

    playerResults.set(sid, { optionPayout: totalPayout, equityValue: Math.round(equityValue), details, equityDetails, finalCash: player.cash });
  }

  return playerResults;
}

// ---------------------------------------------------------------------------
// Portfolio Valuation
// ---------------------------------------------------------------------------

function portfolioValue(player, ventures) {
  let optionValue = 0;
  for (const opt of player.options) {
    const v = ventures.find(x => x.id === opt.ventureId);
    if (v) optionValue += v.currentPremium * opt.contracts;
  }
  let equityValue = 0;
  for (const eq of player.equity) {
    const v = ventures.find(x => x.id === eq.ventureId);
    if (v) equityValue += Math.round(eq.shares * v.sharePrice * 100) / 100;
  }
  return Math.round(player.cash + optionValue + equityValue);
}

function getLeaderboard(room) {
  return [...room.players.values()]
    .map(p => ({
      name: p.name,
      cash: p.cash,
      portfolioValue: portfolioValue(p, room.ventures),
      optionPositions: p.options.reduce((s, o) => s + o.contracts, 0),
      equityPositions: p.equity.length,
    }))
    .sort((a, b) => b.portfolioValue - a.portfolioValue);
}

// ---------------------------------------------------------------------------
// Debrief
// ---------------------------------------------------------------------------

function buildDebriefData(room) {
  return {
    phase: room.phase,
    leaderboard: getLeaderboard(room),
    ventures: room.ventures.map(v => ({
      id: v.id, name: v.name, tagline: v.tagline,
      startPrice: v.initialSharePrice,
      endPrice: v.sharePrice,
      totalReturn: Math.round(((v.sharePrice - v.initialSharePrice) / v.initialSharePrice) * 1000) / 10,
      history: v.priceHistory,
      metrics: v.metrics,
    })),
    aggregateStats: computeAggregateStats(room),
  };
}

function computeAggregateStats(room) {
  let totalBuys = 0, totalSells = 0, totalEquity = 0;
  const ventureDemand = {};
  for (const v of room.ventures) ventureDemand[v.id] = { buys: 0, sells: 0, equity: 0 };

  for (const [, p] of room.players) {
    for (const h of p.history) {
      if (h.phase !== room.phase) continue;
      if (h.action === 'buy_option') { totalBuys++; ventureDemand[h.ventureId].buys++; }
      if (h.action === 'sell_option') { totalSells++; ventureDemand[h.ventureId].sells++; }
      if (h.action === 'buy_equity') { totalEquity++; ventureDemand[h.ventureId].equity++; }
    }
  }
  return { totalBuys, totalSells, totalEquity, ventureDemand };
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

function ventureForClient(v, room) {
  const prevPrice = v.priceHistory.length > 1 ? v.priceHistory[v.priceHistory.length - 2] : v.sharePrice;
  return {
    id: v.id, name: v.name, tagline: v.tagline, pitch: v.pitch,
    industryOutlook: v.industryOutlook,
    sharePrice: v.sharePrice,
    strikePrice: v.strikePrice,
    priceHistory: v.priceHistory,
    premium: v.currentPremium,
    metrics: v.metrics,
    roundNarrative: v.roundNarrative,
    priceChange: prevPrice ? Math.round(((v.sharePrice - prevPrice) / prevPrice) * 1000) / 10 : 0,
    totalReturn: Math.round(((v.sharePrice - v.initialSharePrice) / v.initialSharePrice) * 1000) / 10,
    canBuyEquity: room.phase === 2,
  };
}

function stateForStudent(room, player) {
  return {
    code: room.code, phase: room.phase, round: room.round,
    maxRounds: maxRounds(room.phase),
    status: room.status, roundEndTime: room.roundEndTime,
    ventures: room.ventures.map(v => ventureForClient(v, room)),
    player: {
      name: player.name, cash: player.cash,
      options: player.options, equity: player.equity,
      history: player.history,
      portfolioValue: portfolioValue(player, room.ventures),
    },
    playerCount: room.players.size,
  };
}

function stateForInstructor(room) {
  const players = [...room.players.values()].map(p => ({
    name: p.name, cash: p.cash,
    portfolioValue: portfolioValue(p, room.ventures),
    contracts: p.options.reduce((s, o) => s + o.contracts, 0),
    equityPositions: p.equity.length,
  }));
  return {
    code: room.code, phase: room.phase, round: room.round,
    maxRounds: maxRounds(room.phase),
    status: room.status, roundEndTime: room.roundEndTime,
    ventures: room.ventures.map(v => ventureForClient(v, room)),
    players, playerCount: room.players.size,
    leaderboard: getLeaderboard(room),
  };
}

// ---------------------------------------------------------------------------
// Socket Handlers
// ---------------------------------------------------------------------------

io.on('connection', (socket) => {
  let currentRoom = null;
  let isInstructor = false;

  socket.on('create-room', (_, cb) => {
    const room = createRoom(socket);
    currentRoom = room.code;
    isInstructor = true;
    socket.join(`room:${room.code}`);
    updateAllPremiums(room);
    cb?.({ code: room.code });
    socket.emit('game-state', stateForInstructor(room));
  });

  socket.on('join-room', ({ code, name }, cb) => {
    const room = rooms.get(code?.toUpperCase());
    if (!room) return cb?.({ error: 'Room not found' });
    if (!name?.trim()) return cb?.({ error: 'Name required' });

    const player = addPlayer(room, socket.id, name.trim());
    currentRoom = room.code;
    isInstructor = false;
    socket.join(`room:${room.code}`);
    cb?.({ success: true });
    socket.emit('game-state', stateForStudent(room, player));
    notifyInstructor(room);
  });

  socket.on('start-round', () => {
    const room = rooms.get(currentRoom);
    if (!room || !isInstructor) return;
    if (!['lobby', 'between_rounds', 'phase2_lobby'].includes(room.status)) return;

    room.round++;
    room.status = 'playing';
    room.roundDemand = new Map();
    room.roundEndTime = Date.now() + 210_000;
    // Reset per-round undo tracking on all positions
    for (const [, p] of room.players) {
      for (const opt of p.options) { opt.thisRoundQty = 0; opt.thisRoundCost = 0; }
    }
    updateAllPremiums(room);
    broadcastState(room);
  });

  socket.on('end-round', () => {
    const room = rooms.get(currentRoom);
    if (!room || !isInstructor || room.status !== 'playing') return;
    endRound(room);
  });

  socket.on('buy-option', ({ ventureId, contracts: qty }, cb) => {
    const room = rooms.get(currentRoom);
    if (!room || room.status !== 'playing') return cb?.({ error: 'Round not active' });
    const player = room.players.get(socket.id);
    if (!player) return cb?.({ error: 'Not in game' });
    const venture = room.ventures.find(v => v.id === ventureId);
    if (!venture) return cb?.({ error: 'Venture not found' });

    const n = Math.max(1, Math.round(Number(qty)));
    const cost = venture.currentPremium * n;
    if (cost > player.cash) return cb?.({ error: 'Insufficient funds' });

    player.cash -= cost;
    // Stack onto existing position or create new
    const existing = player.options.find(o => o.ventureId === ventureId);
    if (existing) {
      const totalCost = existing.premiumPerContract * existing.contracts + venture.currentPremium * n;
      existing.contracts += n;
      existing.premiumPerContract = Math.round(totalCost / existing.contracts);
      existing.thisRoundQty = (existing.thisRoundQty || 0) + n;
      existing.thisRoundCost = (existing.thisRoundCost || 0) + cost;
    } else {
      player.options.push({
        ventureId, contracts: n,
        premiumPerContract: venture.currentPremium,
        strikePrice: venture.strikePrice,
        round: room.round,
        thisRoundQty: n,
        thisRoundCost: cost,
      });
    }
    player.history.push({
      round: room.round, phase: room.phase,
      action: 'buy_option', ventureId, contracts: n,
      premium: venture.currentPremium, cost,
    });

    // Demand
    const d = room.roundDemand.get(ventureId) || { buys: 0, sells: 0 };
    d.buys += n;
    room.roundDemand.set(ventureId, d);
    updateAllPremiums(room);

    cb?.({ success: true });
    socket.emit('game-state', stateForStudent(room, player));
    broadcastPremiums(room);
    notifyInstructor(room);
  });

  socket.on('undo-option', ({ ventureId }, cb) => {
    const room = rooms.get(currentRoom);
    if (!room || room.status !== 'playing') return cb?.({ error: 'Round not active' });
    const player = room.players.get(socket.id);
    if (!player) return cb?.({ error: 'Not in game' });

    const position = player.options.find(o => o.ventureId === ventureId);
    if (!position || !position.thisRoundQty) return cb?.({ error: 'Nothing to undo this round' });

    // Refund at original purchase price (not current premium)
    player.cash += position.thisRoundCost;
    position.contracts -= position.thisRoundQty;

    // Reverse demand impact
    const d = room.roundDemand.get(ventureId) || { buys: 0, sells: 0 };
    d.buys = Math.max(0, d.buys - position.thisRoundQty);
    room.roundDemand.set(ventureId, d);

    // Remove history entries for this round's buys on this venture
    player.history = player.history.filter(h =>
      !(h.round === room.round && h.phase === room.phase && h.action === 'buy_option' && h.ventureId === ventureId)
    );

    if (position.contracts <= 0) {
      player.options = player.options.filter(o => o.ventureId !== ventureId);
    } else {
      // Recalculate avg cost from remaining (prior-round) contracts
      const priorCost = position.premiumPerContract * (position.contracts + position.thisRoundQty) - position.thisRoundCost;
      position.premiumPerContract = Math.round(priorCost / position.contracts);
      position.thisRoundQty = 0;
      position.thisRoundCost = 0;
    }

    updateAllPremiums(room);
    cb?.({ success: true });
    socket.emit('game-state', stateForStudent(room, player));
    broadcastPremiums(room);
    notifyInstructor(room);
  });

  socket.on('buy-equity', ({ ventureId, amount }, cb) => {
    const room = rooms.get(currentRoom);
    if (!room || room.status !== 'playing' || room.phase !== 2) return cb?.({ error: 'Equity not available' });
    const player = room.players.get(socket.id);
    if (!player) return cb?.({ error: 'Not in game' });
    const venture = room.ventures.find(v => v.id === ventureId);
    if (!venture) return cb?.({ error: 'Venture not found' });

    const amt = Math.round(Number(amount));
    if (amt < 500) return cb?.({ error: 'Minimum $500' });
    if (amt > player.cash) return cb?.({ error: 'Insufficient funds' });

    const shares = amt / venture.sharePrice;
    player.cash -= amt;
    const existing = player.equity.find(e => e.ventureId === ventureId);
    if (existing) {
      existing.amount += amt;
      existing.shares += shares;
    } else {
      player.equity.push({ ventureId, amount: amt, shares, purchasePrice: venture.sharePrice, round: room.round });
    }
    player.history.push({
      round: room.round, phase: room.phase,
      action: 'buy_equity', ventureId, amount: amt, shares,
    });

    const d = room.roundDemand.get(ventureId) || { buys: 0, sells: 0 };
    d.buys++;
    room.roundDemand.set(ventureId, d);
    updateAllPremiums(room);

    cb?.({ success: true });
    socket.emit('game-state', stateForStudent(room, player));
    notifyInstructor(room);
  });

  socket.on('start-debrief', () => {
    const room = rooms.get(currentRoom);
    if (!room || !isInstructor) return;

    // Exercise/expire all options, liquidate equity
    const phaseResults = resolvePhaseEnd(room);
    room.status = 'debrief';

    const debriefData = buildDebriefData(room);
    debriefData.phaseResults = {};
    for (const [sid, res] of phaseResults) {
      const p = room.players.get(sid);
      if (p) debriefData.phaseResults[p.name] = res;
    }

    io.to(`room:${room.code}`).emit('debrief', debriefData);
    broadcastState(room);
  });

  socket.on('start-phase2', () => {
    const room = rooms.get(currentRoom);
    if (!room || !isInstructor) return;
    room.phase = 2;
    room.round = 0;
    room.status = 'phase2_lobby';
    room.ventures = makeVentures(PHASE2_VENTURES);
    room.roundDemand = new Map();
    for (const [, p] of room.players) { p.options = []; p.equity = []; }
    updateAllPremiums(room);
    broadcastState(room);
  });

  socket.on('finish-game', () => {
    const room = rooms.get(currentRoom);
    if (!room || !isInstructor) return;
    const phaseResults = resolvePhaseEnd(room);
    room.status = 'finished';
    const debriefData = buildDebriefData(room);
    debriefData.phaseResults = {};
    for (const [sid, res] of phaseResults) {
      const p = room.players.get(sid);
      if (p) debriefData.phaseResults[p.name] = res;
    }
    io.to(`room:${room.code}`).emit('debrief', debriefData);
    broadcastState(room);
  });

  socket.on('disconnect', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    if (!isInstructor) {
      room.players.delete(socket.id);
      notifyInstructor(room);
    }
  });

  // --- Helpers ---

  function endRound(room) {
    room.status = 'between_rounds';
    room.roundEndTime = null;
    const results = resolveRound(room);

    for (const [sid, player] of room.players) {
      const s = io.sockets.sockets.get(sid);
      if (!s) continue;
      s.emit('round-results', { round: room.round, ventures: results });
      s.emit('game-state', stateForStudent(room, player));
    }
    const inst = io.sockets.sockets.get(room.instructor);
    if (inst) {
      inst.emit('round-results', { round: room.round, ventures: results });
      inst.emit('game-state', stateForInstructor(room));
    }
  }

  function broadcastState(room) {
    for (const [sid, player] of room.players) {
      io.sockets.sockets.get(sid)?.emit('game-state', stateForStudent(room, player));
    }
    io.sockets.sockets.get(room.instructor)?.emit('game-state', stateForInstructor(room));
  }

  function broadcastPremiums(room) {
    io.to(`room:${room.code}`).emit('premium-update', {
      ventures: room.ventures.map(v => ({ id: v.id, premium: v.currentPremium })),
    });
  }

  function notifyInstructor(room) {
    io.sockets.sockets.get(room.instructor)?.emit('game-state', stateForInstructor(room));
  }
});

server.listen(PORT, () => console.log(`Game server running on http://localhost:${PORT}`));
