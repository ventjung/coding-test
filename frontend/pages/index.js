import { useState, useEffect } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.salesReps || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  const handleAskQuestion = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setError('Error in AI request');
      console.error("Error in AI request:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Next.js + FastAPI Sample</h1>
      {
        error && (
          <p style={{ border: "1px solid red", padding: "1rem" }}>Error : {error}</p>
        )
      }
      <section style={{ marginBottom: "2rem" }}>
        <h2>Dummy Data</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id} style={{ marginBottom: "2rem" }}>
                {user.name} - {user.role}<br /><br />
                <strong>Skills:</strong>
                <ol>
                  {user.skills.map((skill, l) => (
                    <li key={l}>{skill}</li>
                  ))}
                </ol><br />
                <strong>Deals:</strong>
                <table border="1" style={{ marginBottom: "1rem" }}>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.deals.map((deal, i) => (
                      <tr key={i}>
                        <td>{deal.client}</td>
                        <td>{deal.value}</td>
                        <td>{deal.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <strong>Clients:</strong>
                <table border="1" style={{ marginBottom: "1rem" }}>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.clients.map((client, j) => (
                      <tr key={j}>
                        <td>{client.name}</td>
                        <td>{client.industry}</td>
                        <td>{client.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Ask a Question (AI Endpoint)</h2>
        <div>
          <input
            type="text"
            placeholder="Enter your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleAskQuestion}>Ask</button>
        </div>
        {answer && (
          <div style={{ marginTop: "1rem" }}>
            <strong>AI Response:</strong> {
              answer.replace(/\*\*([^*]*?)\*\*/g, '$1')
            }
          </div>
        )}
      </section>
    </div>
  );
}
