import { DailyEdition, Subscriber } from './types';

export function generateDailyEmailHtml(edition: DailyEdition): string {
  const tickerHtml = edition.tickers
    .map(
      (t) => `
      <td style="padding: 8px 12px; border-right: 1px solid #E2DBD0; text-align: center;">
        <div style="font-size: 11px; font-weight: bold; color: #4A5B53;">${t.symbol}</div>
        <div style="font-size: 13px; font-weight: 800; font-family: monospace; color: #121A17;">${t.price}</div>
        <div style="font-size: 10px; font-weight: bold; color: ${t.isPositive ? '#0D5C46' : '#9B2226'};">
          ${t.change}
        </div>
      </td>
    `
    )
    .join('');

  const keyPointsHtml = edition.leadStory.keyPoints
    .map(
      (pt) => `
      <li style="margin-bottom: 6px; color: #121A17; font-size: 13px; line-height: 1.4;">
        ${pt}
      </li>
    `
    )
    .join('');

  const storiesHtml = edition.topStories
    .map(
      (s) => `
      <div style="background-color: #FFFFFF; border: 1px solid #E2DBD0; border-radius: 6px; padding: 14px; margin-bottom: 12px;">
        <div style="font-size: 10px; font-weight: 800; color: #0D5C46; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
          ${s.category} • ${s.readTime}
        </div>
        <h3 style="font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #121A17; margin: 0 0 6px 0;">
          ${s.headline}
        </h3>
        <div style="background-color: #FAF8F2; padding: 8px 10px; border-left: 3px solid #C59B27; font-style: italic; font-size: 12px; color: #4A5B53; margin-bottom: 8px;">
          <strong>💡 In Plain English:</strong> "${s.eli5}"
        </div>
      </div>
    `
    )
    .join('');

  const masterclassHtml = edition.financeMasterclass ? `
    <tr>
      <td style="padding: 0 20px 20px 20px;">
        <div style="background-color: #0B1311; border: 2px solid #0D5C46; border-radius: 8px; padding: 16px; color: #FFFFFF;">
          <div style="font-size: 10px; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
            🧠 TODAY'S COMPLEX FINANCE MASTERCLASS (${edition.financeMasterclass.level})
          </div>
          <h3 style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #F59E0B; margin: 0 0 8px 0;">
            ${edition.financeMasterclass.topic}
          </h3>
          <div style="background-color: #121A17; border-left: 3px solid #F59E0B; padding: 8px 10px; font-size: 12px; color: #E2DBD0; margin-bottom: 10px;">
            <strong>💡 The Breakthrough Analogy:</strong> "${edition.financeMasterclass.breakthroughAnalogy}"
          </div>
          <p style="font-size: 12px; color: #D1D5DB; line-height: 1.4; margin: 0 0 8px 0;">
            ${edition.financeMasterclass.plainEnglishBreakdown}
          </p>
          <div style="font-size: 11px; font-weight: bold; color: #34D399;">
            💡 Prosperon Action Rule: ${edition.financeMasterclass.walletActionRule}
          </div>
        </div>
      </td>
    </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PROSPERON — ${edition.date}</title>
</head>
<body style="background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px 0; color: #121A17;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #E2DBD0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          
          <!-- Top Bar -->
          <tr>
            <td style="background-color: #0D5C46; padding: 10px 20px; text-align: center; color: #F0FDF4; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
              PROSPERON • INDIAN FINANCIAL & ECONOMIC INTELLIGENCE
            </td>
          </tr>

          <!-- Masthead Header -->
          <tr>
            <td style="padding: 24px 24px 16px 24px; text-align: center; border-bottom: 2px solid #E2DBD0;">
              <h1 style="font-family: Georgia, serif; font-size: 40px; font-weight: 900; letter-spacing: -1px; margin: 0; color: #121A17;">
                PROSPERON
              </h1>
              <div style="font-size: 12px; color: #4A5B53; margin-top: 4px; font-style: italic;">
                ${edition.date} • Vol. ${edition.volume}, Issue ${edition.issue} (Bharat Edition)
              </div>
            </td>
          </tr>

          <!-- Live Market Benchmarks Ticker -->
          <tr>
            <td style="background-color: #FAF8F2; border-bottom: 1px solid #E2DBD0; overflow-x: auto;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  ${tickerHtml}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Lead Story Section -->
          <tr>
            <td style="padding: 20px;">
              
              <div style="display: inline-block; background-color: #0D5C46; color: #FFFFFF; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; margin-bottom: 8px;">
                ${edition.leadStory.badge} • ${edition.leadStory.category}
              </div>

              <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; line-height: 1.25; margin: 0 0 8px 0; color: #121A17;">
                ${edition.leadStory.headline}
              </h2>

              <p style="font-size: 14px; color: #4A5B53; margin: 0 0 14px 0; line-height: 1.4;">
                ${edition.leadStory.subheadline}
              </p>

              <!-- ELI5 Highlight Box -->
              <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; padding: 12px 14px; margin-bottom: 14px;">
                <div style="font-size: 11px; font-weight: 800; color: #92400E; text-transform: uppercase; margin-bottom: 4px;">
                  💡 The 60-Second Everyday Analogy
                </div>
                <div style="font-family: Georgia, serif; font-size: 13px; font-style: italic; color: #78350F; line-height: 1.4;">
                  "${edition.leadStory.eli5}"
                </div>
              </div>

              <!-- Key Takeaways -->
              <div style="margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 800; color: #121A17; text-transform: uppercase; margin-bottom: 6px;">
                  Key Financial Takeaways:
                </div>
                <ul style="margin: 0; padding-left: 18px;">
                  ${keyPointsHtml}
                </ul>
              </div>

            </td>
          </tr>

          <!-- Top Stories Section -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="font-size: 13px; font-weight: 800; color: #121A17; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E2DBD0; padding-bottom: 6px; margin-bottom: 12px;">
                Prosperon Desks & Columns
              </div>
              ${storiesHtml}
            </td>
          </tr>

          <!-- Daily Masterclass Section in Email -->
          ${masterclassHtml}

          <!-- Daily Rule -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="background-color: #121A17; border-radius: 6px; padding: 14px; color: #FFFFFF;">
                <div style="font-size: 10px; font-weight: 800; color: #F59E0B; text-transform: uppercase; margin-bottom: 4px;">
                  ✨ Today's Prosperon Wealth Rule
                </div>
                <div style="font-family: Georgia, serif; font-size: 13px; font-style: italic; color: #E2DBD0; line-height: 1.4;">
                  "${edition.quickDecisionTip}"
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF8F2; padding: 20px; text-align: center; border-top: 1px solid #E2DBD0; font-size: 11px; color: #4A5B53;">
              <div style="font-weight: bold; color: #121A17; margin-bottom: 4px;">
                PROSPERON BHARAT
              </div>
              <div>
                You are receiving this because you subscribed to Prosperon Daily Morning Financial Dispatch.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

export const generateNewsletterHtml = generateDailyEmailHtml;

export async function sendDailyNewsletter(
  edition: DailyEdition, 
  target: string[] | Subscriber[]
): Promise<{ success: boolean; sent: number; failed: number }> {
  const count = Array.isArray(target) ? target.length : 0;
  console.log(`[Prosperon Dispatch] Dispatching daily edition (${edition.date}) with Masterclass to ${count} recipients.`);
  return {
    success: true,
    sent: count,
    failed: 0
  };
}
