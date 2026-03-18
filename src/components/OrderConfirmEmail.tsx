/**
 * OrderConfirmEmail — 注文確認メール文面コンポーネント
 *
 * このコンポーネントはメール文面をレンダリングします。
 * 実際のメール送信は後で実装予定（sendgrid / nodemailer 等）。
 *
 * Usage:
 *   import OrderConfirmEmail from "@/components/OrderConfirmEmail";
 *   <OrderConfirmEmail name="山田太郎" plan="Pro" price="¥89,800" />
 */

export interface OrderConfirmEmailProps {
  /** 注文者氏名 */
  name: string;
  /** 選択プラン名（Starter / Pro） */
  plan: "Starter" | "Pro";
  /** 価格文字列（例: ¥49,800） */
  price: string;
  /** メールアドレス */
  email: string;
  /** 注文ID（任意） */
  orderId?: string;
  /** 注文日時（省略時は現在） */
  orderedAt?: Date;
}

/**
 * メール本文をプレーンテキストで生成するユーティリティ
 */
export function buildOrderConfirmEmailText(props: OrderConfirmEmailProps): string {
  const { name, plan, price, email, orderId, orderedAt } = props;
  const date = (orderedAt ?? new Date()).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
${name} 様

この度はCOCORO OSをご注文いただき、誠にありがとうございます。
以下の内容でご注文を承りました。

────────────────────────────────
【ご注文内容】
プラン    ：${plan} プラン
お支払金額 ：${price}（税込・ハードウェア込み）
ご注文日   ：${date}
メール     ：${email}
${orderId ? `注文ID     ：${orderId}` : ""}
────────────────────────────────

担当者より3営業日以内にご連絡いたします。
お届け・お支払い方法の詳細については、担当者よりご案内いたします。

【次のステップ】
1. 担当者からのメールをお待ちください（3営業日以内）
2. お支払い方法のご確認
3. miniPCの発送手配（約10〜14営業日）
4. COCORO OS セットアップサポート

ご不明な点がございましたら、下記までお気軽にお問い合わせください。
support@cocoro-os.com

COCORO OS — by MDL Systems / ANTIGRAVITY
https://cocoro-os.com
`.trim();
}

/**
 * メール文面をHTMLで生成するユーティリティ
 */
export function buildOrderConfirmEmailHtml(props: OrderConfirmEmailProps): string {
  const { name, plan, price, email, orderId, orderedAt } = props;
  const date = (orderedAt ?? new Date()).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const planColor = plan === "Pro" ? "#c084fc" : "#ff69b4";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ご注文確認 — COCORO OS</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0d0d12;border-radius:16px;border:1px solid rgba(255,105,180,0.2);overflow:hidden;max-width:560px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;background:linear-gradient(135deg,rgba(255,105,180,0.08),rgba(192,132,252,0.08));border-bottom:1px solid rgba(255,105,180,0.12);">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#ff69b4;">COCORO OS</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;">ご注文ありがとうございます</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 24px;color:#a1a1b5;font-size:14px;line-height:1.7;">
                <strong style="color:#e8e8f0;">${name}</strong> 様<br/>
                この度はCOCORO OSをご注文いただき、誠にありがとうございます。
              </p>

              <!-- Order Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,105,180,0.04);border:1px solid rgba(255,105,180,0.15);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ff69b4;">ご注文内容</p>
                    <table width="100%" cellpadding="4" cellspacing="0">
                      <tr>
                        <td style="color:#6b6b80;font-size:13px;width:40%;">プラン</td>
                        <td style="color:${planColor};font-weight:700;font-size:13px;">${plan} プラン</td>
                      </tr>
                      <tr>
                        <td style="color:#6b6b80;font-size:13px;">お支払金額</td>
                        <td style="color:#e8e8f0;font-weight:700;font-size:16px;">${price} <span style="font-size:12px;color:#6b6b80;">税込・HW込み</span></td>
                      </tr>
                      <tr>
                        <td style="color:#6b6b80;font-size:13px;">ご注文日</td>
                        <td style="color:#a1a1b5;font-size:13px;">${date}</td>
                      </tr>
                      <tr>
                        <td style="color:#6b6b80;font-size:13px;">メール</td>
                        <td style="color:#a1a1b5;font-size:13px;">${email}</td>
                      </tr>
                      ${orderId ? `<tr><td style="color:#6b6b80;font-size:13px;">注文ID</td><td style="color:#a1a1b5;font-size:12px;font-family:monospace;">${orderId}</td></tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Notice -->
              <p style="margin:0 0 24px;color:#a1a1b5;font-size:14px;line-height:1.7;">
                担当者より <strong style="color:#ff69b4;">3営業日以内</strong> にご連絡いたします。<br/>
                お届け・お支払い方法の詳細については、担当者よりご案内いたします。
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c084fc;">次のステップ</td></tr>
                ${[
                  "担当者からのメールをお待ちください（3営業日以内）",
                  "お支払い方法のご確認",
                  "miniPCの発送手配（約10〜14営業日）",
                  "COCORO OS セットアップサポート",
                ]
                  .map(
                    (s, i) =>
                      `<tr><td style="padding:6px 0;color:#a1a1b5;font-size:13px;">
                  <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:rgba(192,132,252,0.15);color:#c084fc;font-size:11px;text-align:center;line-height:20px;margin-right:8px;">${i + 1}</span>${s}
                </td></tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0 0 4px;color:#4b5563;font-size:12px;">ご不明な点は support@cocoro-os.com までご連絡ください。</p>
              <p style="margin:0;color:#374151;font-size:11px;">© 2026 MDL Systems / ANTIGRAVITY — COCORO OS</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * プレビュー用Reactコンポーネント（開発・デザイン確認用）
 */
export default function OrderConfirmEmail(props: OrderConfirmEmailProps) {
  const html = buildOrderConfirmEmailHtml(props);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ fontFamily: "inherit" }}
    />
  );
}
