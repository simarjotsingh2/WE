import { useMemo, useState } from "react";
import "./donate.css";

const BANK = {
    orgName: "WE — Women Empowerment at Workplace",
    interacEmail: "donations@we-example.org", // CHANGE
    accountName: "WE Women Empowerment",      // CHANGE
    accountNumber: "0000000000",              // CHANGE
    institutionNumber: "000",                 // CHANGE
    transitNumber: "00000",                   // CHANGE
    swiftBic: "XXXXXXXXXXX",                  // optional
    upiId: "we@bank",                         // CHANGE for India
};

const copy = t => navigator.clipboard?.writeText(t);

export default function Donate() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("CAD");
    const reference = useMemo(() => `WE-${Date.now().toString(36).slice(-6).toUpperCase()}`, []);

    const upiLink = `upi://pay?pa=${encodeURIComponent(BANK.upiId)}&pn=${encodeURIComponent(BANK.orgName)}&am=${encodeURIComponent(amount || "")}&cu=INR&tn=${encodeURIComponent(reference)}`;

    return (
        <section className="don-wrap">
            <div className="don-hero">
                <h1 className="don-title">Donate to <span>WE</span></h1>
                <p className="don-lead">Choose a method below and include your unique reference.</p>
            </div>

            {/* amount row */}
            <form className="don-form">
                <label>Amount
                    <div className="don-amt">
                        <select value={currency} onChange={e => setCurrency(e.target.value)}><option>CAD</option><option>INR</option><option>USD</option></select>
                        <input inputMode="decimal" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                </label>
                <label>Reference (add in memo)
                    <div className="copyline"><code>{reference}</code><button type="button" onClick={() => copy(reference)}>Copy</button></div>
                </label>
            </form>

            <div className="don-grid">
                <article className="don-card">
                    <h3>Interac e-Transfer (Canada)</h3>
                    <ul className="list">
                        <li>Recipient email: <span className="mono">{BANK.interacEmail}</span> <button className="mini" onClick={() => copy(BANK.interacEmail)} type="button">Copy</button></li>
                        <li>Recipient name: <span className="mono">{BANK.accountName}</span></li>
                        <li>Memo/message: <span className="mono">{reference}</span> <button className="mini" onClick={() => copy(reference)} type="button">Copy</button></li>
                    </ul>
                </article>

                <article className="don-card">
                    <h3>Bank Transfer</h3>
                    <ul className="list">
                        <li>Account name: <span className="mono">{BANK.accountName}</span></li>
                        <li>Account number: <span className="mono">{BANK.accountNumber}</span> <button className="mini" onClick={() => copy(BANK.accountNumber)} type="button">Copy</button></li>
                        <li>Institution #: <span className="mono">{BANK.institutionNumber}</span> &nbsp; Transit #: <span className="mono">{BANK.transitNumber}</span></li>
                        {BANK.swiftBic && <li>SWIFT/BIC: <span className="mono">{BANK.swiftBic}</span></li>}
                        <li>Reference/memo: <span className="mono">{reference}</span> <button className="mini" onClick={() => copy(reference)} type="button">Copy</button></li>
                    </ul>
                </article>

                <article className="don-card">
                    <h3>UPI (India)</h3>
                    <ul className="list">
                        <li>UPI ID: <span className="mono">{BANK.upiId}</span> <button className="mini" onClick={() => copy(BANK.upiId)} type="button">Copy</button></li>
                        <li>Note/remark: <span className="mono">{reference}</span></li>
                    </ul>
                    <a className="btn-primary" href={upiLink}>Pay in UPI app</a>
                </article>
            </div>

            <p className="footnote">
                After payment, email your receipt and reference <span className="mono">{reference}</span> to{" "}
                <a href={`mailto:${BANK.interacEmail}?subject=Donation%20Receipt%20${reference}`}>us</a>.
            </p>
        </section>
    );
}
