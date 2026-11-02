import type { ReactNode } from "react";

import { inr, type ProjectCategory } from "@/app/lib/content";

/* Product and portfolio mockups. Sample data, but every total is computed from its rows. */

const staff = [
  { name: "Fathima K", role: "Counter", gross: 18000, days: 26 },
  { name: "Jithin P", role: "Store", gross: 21000, days: 24 },
  { name: "Sreelakshmi V", role: "Accounts", gross: 32000, days: 26 },
  { name: "Muhammed Rafi", role: "Delivery", gross: 19500, days: 25 },
];
const WORKING_DAYS = 26;
const PF_RATE = 0.12;

function PayrollScreen() {
  const rows = staff.map((person) => {
    const earned = Math.round((person.gross * person.days) / WORKING_DAYS);
    return { ...person, earned, net: earned - Math.round(earned * PF_RATE) };
  });
  const total = rows.reduce((sum, row) => sum + row.net, 0);

  return (
    <div className="ui">
      <div className="ui-head">
        <strong>Payroll, October</strong>
        <span>{rows.length} staff</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Staff</th>
            <th className="num">Days</th>
            <th className="num">Net pay</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                {row.name}
                <small>{row.role}</small>
              </td>
              <td className={`num ${row.days < WORKING_DAYS ? "flag" : ""}`}>
                {row.days}/{WORKING_DAYS}
              </td>
              <td className="num">{inr(row.net)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ui-total">
        <span>To pay on the 31st</span>
        <b>{inr(total)}</b>
      </div>
    </div>
  );
}

const branches = [
  { name: "Perinthalmanna", week: 412000, last: 398000 },
  { name: "Manjeri", week: 356000, last: 301000 },
  { name: "Malappuram", week: 289000, last: 294000 },
  { name: "Tirur", week: 197000, last: 188000 },
];

function DashboardScreen() {
  const total = branches.reduce((sum, branch) => sum + branch.week, 0);
  const peak = Math.max(...branches.map((branch) => branch.week));
  const growth = (branch: (typeof branches)[number]) =>
    ((branch.week - branch.last) / branch.last) * 100;
  const leader = branches.reduce((best, branch) =>
    growth(branch) > growth(best) ? branch : best,
  );

  return (
    <div className="ui">
      <div className="ui-head">
        <strong>Sales this week</strong>
        <span>{inr(total)}</span>
      </div>
      <p className="ui-finding">
        {leader.name} is up {growth(leader).toFixed(1)}%
      </p>
      <ul className="ui-bars">
        {branches.map((branch) => (
          <li key={branch.name} className={branch === leader ? "is-leader" : ""}>
            <span>{branch.name}</span>
            <b>{inr(branch.week)}</b>
            <i style={{ width: `${(branch.week / peak) * 100}%` }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const sale = [
  { item: "Wireless mouse", qty: 2, price: 799 },
  { item: "USB-C charger", qty: 1, price: 1299 },
  { item: "HDMI cable", qty: 3, price: 349 },
];
const GST_RATE = 0.18;

function PosScreen() {
  const subtotal = sale.reduce((sum, line) => sum + line.qty * line.price, 0);
  const gst = subtotal * GST_RATE;

  return (
    <div className="ui">
      <div className="ui-head">
        <strong>New sale</strong>
        <span>Counter 1</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th className="num">Qty</th>
            <th className="num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sale.map((line) => (
            <tr key={line.item}>
              <td>{line.item}</td>
              <td className="num">{line.qty}</td>
              <td className="num">{inr(line.qty * line.price)}</td>
            </tr>
          ))}
          <tr>
            <td>GST 18%</td>
            <td />
            <td className="num">{inr(gst, 2)}</td>
          </tr>
        </tbody>
      </table>
      <div className="ui-total">
        <span>Total</span>
        <b>{inr(subtotal + gst, 2)}</b>
      </div>
    </div>
  );
}

export function ProductScreen({ title }: { title: string }) {
  const key = title.toLowerCase();
  if (key.includes("payroll")) return <PayrollScreen />;
  if (key.includes("dashboard")) return <DashboardScreen />;
  return <PosScreen />;
}

const queue = [
  { time: "9:30", name: "Shameema A", state: "Done" },
  { time: "9:45", name: "Rajan N", state: "With doctor" },
  { time: "10:00", name: "Hiba M", state: "Waiting" },
  { time: "10:15", name: "Vinod K", state: "Waiting" },
];

function Phones() {
  const waiting = queue.filter((row) => row.state === "Waiting").length;
  return (
    <div className="phones">
      <div className="ui phone phone-back">
        <div className="ui-head">
          <strong>Rajan N</strong>
          <span>Age 54</span>
        </div>
        <dl className="phone-record">
          <div>
            <dt>Blood pressure</dt>
            <dd>138/86</dd>
          </div>
          <div>
            <dt>Fasting sugar</dt>
            <dd>112 mg/dL</dd>
          </div>
          <div>
            <dt>Next review</dt>
            <dd>2 weeks</dd>
          </div>
        </dl>
      </div>
      <div className="ui phone phone-front">
        <div className="ui-head">
          <strong>Today</strong>
          <span>{waiting} waiting</span>
        </div>
        <ul className="phone-list">
          {queue.map((row) => (
            <li key={row.name}>
              <b>{row.time}</b>
              <span>{row.name}</span>
              <em className={row.state === "With doctor" ? "flag" : ""}>{row.state}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const ops = [
  { branch: "Perinthalmanna", orders: 1284, avg: 321 },
  { branch: "Manjeri", orders: 1096, avg: 325 },
  { branch: "Malappuram", orders: 942, avg: 307 },
  { branch: "Tirur", orders: 655, avg: 301 },
];

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <i />
        <i />
        <i />
      </div>
      {children}
    </div>
  );
}

function OpsScreen() {
  const orders = ops.reduce((sum, row) => sum + row.orders, 0);
  return (
    <BrowserFrame>
      <div className="ui">
        <div className="ui-head">
          <strong>All branches</strong>
          <span>{orders.toLocaleString("en-IN")} orders</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Branch</th>
              <th className="num">Orders</th>
              <th className="num">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {ops.map((row) => (
              <tr key={row.branch}>
                <td>{row.branch}</td>
                <td className="num">{row.orders.toLocaleString("en-IN")}</td>
                <td className="num">{inr(row.orders * row.avg)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BrowserFrame>
  );
}

export function ProjectScreen({ category }: { category: ProjectCategory }) {
  return category === "Mobile" ? <Phones /> : <OpsScreen />;
}
