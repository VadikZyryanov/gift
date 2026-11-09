export default function App() {
  return (
    <main className="page">
      <section className="card" aria-labelledby="page-title">
        <span className="badge">Первый шаг</span>
        <h1 id="page-title">Gift</h1>
        <p className="description">
          Здесь начинается что-то хорошее.
          <br />
          Базовая страница нового проекта на React.
        </p>
        <div className="stack" aria-label="Технологии проекта">
          <span>React</span>
          <span>TypeScript</span>
          <span>Vite</span>
        </div>
      </section>
    </main>
  );
}
