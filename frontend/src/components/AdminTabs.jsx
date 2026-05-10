function AdminTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div style={containerStyle}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            ...tabButtonStyle,
            ...(activeTab === tab.id ? activeTabStyle : {}),
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const containerStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "24px",
  background: "rgba(255,255,255,0.78)",
  padding: "12px",
  borderRadius: "18px",
  border: "1px solid #e8e0e5",
  boxShadow: "0 10px 24px rgba(67,33,77,0.08)",
};

const tabButtonStyle = {
  border: "1px solid #d8c5df",
  background: "#fff7fb",
  color: "#43214d",
  padding: "11px 15px",
  borderRadius: "14px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const activeTabStyle = {
  background: "linear-gradient(135deg, #5b3765, #43214d)",
  color: "white",
  border: "1px solid #43214d",
  boxShadow: "0 10px 20px rgba(67,33,77,0.22)",
};

export default AdminTabs;