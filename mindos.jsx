import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are MINDOS — a personal AI built for a 20-year-old solo founder who is simultaneously doing BTech CSE (AI/ML specialization) and building a brand from scratch. He has 2 years to make the brand his sole income.

Your personality is a blend of three voices:
1. A student hustling alone — you get the struggle, the chaos, the pressure
2. An ambitious founder — you think in leverage, priorities, and outcomes
3. A disciplined executor — you cut through noise and give clear next actions

When he gives you a brain dump (raw thoughts, stress, tasks, ideas, worries), your job is to:
1. Acknowledge briefly (1 sentence max — no therapy, just real talk)
2. Extract and organize everything into three categories:
   - 🎓 COLLEGE
   - 🚀 BRAND
   - 🧠 PERSONAL
3. Under each category, list action items ranked by priority (P1 = do today, P2 = do this week, P3 = someday)
4. End with ONE "Focus of the Day" — the single most important thing he should do right now

Format your response EXACTLY like this:

---ACKNOWLEDGE---
[1 sentence]

---COLLEGE---
[P1] Task
[P2] Task
(skip category if nothing relevant)

---BRAND---
[P1] Task
[P2] Task

---PERSONAL---
[P1] Task
[P2] Task

---FOCUS---
[Single most important action right now, 1 sentence, direct]

Be brutally honest. Never pad. Never flatter. Talk like a co-founder who also happens to be his most disciplined friend.`;

function parseResponse(text) {
  const sections = {
    acknowledge: "",
    college: [],
    brand: [],
    personal: [],
    focus: "",
  };

  const ackMatch = text.match(/---ACKNOWLEDGE---\s*([\s\S]*?)(?=---|$)/);
  if (ackMatch) sections.acknowledge = ackMatch[1].trim();

  const collegeMatch = text.match(/---COLLEGE---\s*([\s\S]*?)(?=---|$)/);
  if (collegeMatch)
    sections.college = collegeMatch[1]
      .trim()
      .split("\n")
      .filter((l) => l.trim());

  const brandMatch = text.match(/---BRAND---\s*([\s\S]*?)(?=---|$)/);
  if (brandMatch)
    sections.brand = brandMatch[1]
      .trim()
      .split("\n")
      .filter((l) => l.trim());

  const personalMatch = text.match(/---PERSONAL---\s*([\s\S]*?)(?=---|$)/);
  if (personalMatch)
    sections.personal = personalMatch[1]
      .trim()
      .split("\n")
      .filter((l) => l.trim());

  const focusMatch = text.match(/---FOCUS---\s*([\s\S]*?)(?=---|$)/);
  if (focusMatch) sections.focus = focusMatch[1].trim();

  return sections;
}

function PriorityTag({ label }) {
  const colors = {
    P1: { bg: "#ff4d4d22", border: "#ff4d4d", text: "#ff6b6b" },
    P2: { bg: "#ffa50022", border: "#ffa500", text: "#ffc35a" },
    P3: { bg: "#4da6ff22", border: "#4da6ff", text: "#7dc0ff" },
  };
  const c = colors[label] || colors.P3;
  return (
    <span
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        borderRadius: "4px",
        padding: "1px 7px",
        fontSize: "10px",
        fontFamily: "'Space Mono', monospace",
        fontWeight: "700",
        letterSpacing: "0.05em",
        marginRight: "8px",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

function TaskItem({ line, index }) {
  const [done, setDone] = useState(false);
  const priorityMatch = line.match(/\[(P[123])\]/);
  const priority = priorityMatch ? priorityMatch[1] : null;
  const text = line.replace(/\[P[123]\]\s*/, "").trim();

  return (
    <div
      onClick={() => setDone(!done)}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 14px",
        marginBottom: "6px",
        background: done ? "#ffffff08" : "#ffffff0d",
        border: `1px solid ${done ? "#ffffff10" : "#ffffff18"}`,
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        animation: `fadeSlideIn 0.3s ease ${index * 0.06}s both`,
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "4px",
          border: `1.5px solid ${done ? "#00ff9d" : "#ffffff30"}`,
          background: done ? "#00ff9d22" : "transparent",
          marginRight: "12px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
      >
        {done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#00ff9d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      {priority && <PriorityTag label={priority} />}
      <span
        style={{
          color: done ? "#ffffff30" : "#e0e0e0",
          fontSize: "13px",
          fontFamily: "'DM Sans', sans-serif",
          textDecoration: done ? "line-through" : "none",
          transition: "all 0.2s ease",
          lineHeight: "1.4",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function Section({ icon, title, items, color, delay }) {
  if (!items || items.length === 0) return null;
  return (
    <div
      style={{
        animation: `fadeSlideIn 0.4s ease ${delay}s both`,
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "16px" }}>{icon}</span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.12em",
            color: color,
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: `${color}30`,
            marginLeft: "4px",
          }}
        />
      </div>
      {items.map((item, i) => (
        <TaskItem key={i} line={item} index={i} />
      ))}
    </div>
  );
}

export default function Mindos() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 2px; }
      textarea:focus { outline: none; }
      textarea { resize: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  async function handleDump() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setParsed(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const result = parseResponse(text);
      setParsed(result);
      setHistory((prev) => [
        { dump: input, result, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 9),
      ]);
    } catch (e) {
      setParsed({
        acknowledge: "Something went wrong. Try again.",
        college: [],
        brand: [],
        personal: [],
        focus: "",
      });
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleDump();
    }
  }

  const totalTasks =
    (parsed?.college?.length || 0) +
    (parsed?.brand?.length || 0) +
    (parsed?.personal?.length || 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        backgroundImage:
          "radial-gradient(ellipse at 20% 20%, #1a0a2e 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, #0a1a2e 0%, transparent 50%)",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e0e0e0",
        padding: "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "28px 32px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: "fadeSlideIn 0.5s ease both",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "26px",
                fontWeight: "800",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #00ff9d 50%, #4da6ff 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientShift 4s ease infinite",
                letterSpacing: "-0.02em",
              }}
            >
              MINDOS
            </h1>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                color: "#ffffff30",
                letterSpacing: "0.15em",
              }}
            >
              v1.0
            </span>
          </div>
          <p
            style={{
              fontSize: "11px",
              color: "#ffffff40",
              fontFamily: "'Space Mono', monospace",
              marginTop: "2px",
              letterSpacing: "0.05em",
            }}
          >
            your mind. organized.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: "#ffffff08",
              border: "1px solid #ffffff15",
              borderRadius: "8px",
              padding: "8px 14px",
              color: "#ffffff50",
              fontSize: "11px",
              fontFamily: "'Space Mono', monospace",
              cursor: "pointer",
              letterSpacing: "0.05em",
            }}
          >
            {showHistory ? "← back" : `history (${history.length})`}
          </button>
        )}
      </div>

      <div style={{ padding: "24px 32px 32px", maxWidth: "760px" }}>
        {!showHistory ? (
          <>
            {/* Input Area */}
            <div
              style={{
                animation: "fadeSlideIn 0.5s ease 0.1s both",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "#ffffff06",
                  border: "1px solid #ffffff15",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  transition: "border-color 0.2s",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Dump everything here. Assignments due. Brand ideas. Things stressing you out. Half-formed thoughts. All of it. Don't filter."
                  rows={5}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#e0e0e0",
                    fontSize: "14px",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: "1.7",
                    letterSpacing: "0.01em",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #ffffff10",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#ffffff25",
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {charCount > 0 ? `${charCount} chars` : "⌘ + Enter to process"}
                  </span>
                  <button
                    onClick={handleDump}
                    disabled={!input.trim() || loading}
                    style={{
                      background: input.trim() && !loading
                        ? "linear-gradient(135deg, #00ff9d20, #4da6ff20)"
                        : "#ffffff08",
                      border: `1px solid ${input.trim() && !loading ? "#00ff9d40" : "#ffffff10"}`,
                      borderRadius: "8px",
                      padding: "10px 22px",
                      color: input.trim() && !loading ? "#00ff9d" : "#ffffff25",
                      fontSize: "12px",
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: "700",
                      cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                      letterSpacing: "0.08em",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            border: "1.5px solid #00ff9d40",
                            borderTop: "1.5px solid #00ff9d",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />
                        processing
                      </>
                    ) : (
                      "→ PROCESS DUMP"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Output */}
            {parsed && (
              <div style={{ animation: "fadeSlideIn 0.4s ease both" }}>
                {/* Acknowledge */}
                {parsed.acknowledge && (
                  <div
                    style={{
                      background: "#ffffff06",
                      border: "1px solid #ffffff10",
                      borderLeft: "3px solid #00ff9d",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      marginBottom: "20px",
                      fontSize: "13px",
                      color: "#ffffffb0",
                      fontStyle: "italic",
                      lineHeight: "1.6",
                      animation: "fadeSlideIn 0.3s ease both",
                    }}
                  >
                    {parsed.acknowledge}
                  </div>
                )}

                {/* Stats bar */}
                {totalTasks > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "20px",
                      animation: "fadeSlideIn 0.3s ease 0.05s both",
                    }}
                  >
                    {[
                      { label: "total tasks", val: totalTasks, color: "#ffffff60" },
                      { label: "college", val: parsed.college.length, color: "#4da6ff" },
                      { label: "brand", val: parsed.brand.length, color: "#ff6b9d" },
                      { label: "personal", val: parsed.personal.length, color: "#ffc35a" },
                    ].map(
                      (s) =>
                        s.val > 0 && (
                          <div
                            key={s.label}
                            style={{
                              background: "#ffffff06",
                              border: "1px solid #ffffff10",
                              borderRadius: "8px",
                              padding: "8px 14px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "18px",
                                fontFamily: "'Space Mono', monospace",
                                fontWeight: "700",
                                color: s.color,
                              }}
                            >
                              {s.val}
                            </div>
                            <div
                              style={{
                                fontSize: "9px",
                                color: "#ffffff30",
                                fontFamily: "'Space Mono', monospace",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                marginTop: "2px",
                              }}
                            >
                              {s.label}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                )}

                {/* Sections */}
                <Section icon="🎓" title="College" items={parsed.college} color="#4da6ff" delay={0.1} />
                <Section icon="🚀" title="Brand" items={parsed.brand} color="#ff6b9d" delay={0.2} />
                <Section icon="🧠" title="Personal" items={parsed.personal} color="#ffc35a" delay={0.3} />

                {/* Focus */}
                {parsed.focus && (
                  <div
                    style={{
                      animation: "fadeSlideIn 0.4s ease 0.4s both",
                      background:
                        "linear-gradient(135deg, #00ff9d08, #4da6ff08)",
                      border: "1px solid #00ff9d30",
                      borderRadius: "12px",
                      padding: "18px 20px",
                      marginTop: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        color: "#00ff9d80",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      ⚡ focus of the day
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        color: "#ffffff",
                        fontWeight: "500",
                        lineHeight: "1.5",
                      }}
                    >
                      {parsed.focus}
                    </div>
                  </div>
                )}

                {/* New dump button */}
                <button
                  onClick={() => {
                    setInput("");
                    setParsed(null);
                    setCharCount(0);
                    setTimeout(() => textareaRef.current?.focus(), 100);
                  }}
                  style={{
                    marginTop: "20px",
                    background: "transparent",
                    border: "1px solid #ffffff15",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    color: "#ffffff30",
                    fontSize: "11px",
                    fontFamily: "'Space Mono', monospace",
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  + new dump
                </button>
              </div>
            )}

            {/* Empty state */}
            {!parsed && !loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  animation: "fadeSlideIn 0.5s ease 0.2s both",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.3 }}>
                  🧠
                </div>
                <p
                  style={{
                    color: "#ffffff20",
                    fontSize: "12px",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.05em",
                    lineHeight: "1.8",
                  }}
                >
                  your chaos goes in.
                  <br />
                  clarity comes out.
                </p>
              </div>
            )}
          </>
        ) : (
          /* History view */
          <div style={{ animation: "fadeSlideIn 0.3s ease both" }}>
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                color: "#ffffff40",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              past dumps
            </h2>
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => {
                  setParsed(h.result);
                  setInput(h.dump);
                  setShowHistory(false);
                }}
                style={{
                  background: "#ffffff06",
                  border: "1px solid #ffffff10",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  animation: `fadeSlideIn 0.3s ease ${i * 0.05}s both`,
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "#ffffff25",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h.time}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "9px",
                      color: "#00ff9d40",
                    }}
                  >
                    {(h.result.college?.length || 0) +
                      (h.result.brand?.length || 0) +
                      (h.result.personal?.length || 0)}{" "}
                    tasks
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#ffffff50",
                    lineHeight: "1.5",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {h.dump}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
