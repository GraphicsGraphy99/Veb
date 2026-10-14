import { stats } from "../data/siteContent.js";

export default function Stats() {
  return (
    <section className="stats" aria-label="Our achievements">
      <div className="container stats-grid">
        {stats.map((item) => (
          <div className="stat" key={item.label}>
            <p className="stat-value">{item.value}</p>
            <p className="stat-label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
