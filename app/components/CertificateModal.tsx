"use client";

export default function CertificateModal({
  open,
  onClose,
  files,
  loading,
}: any) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        zIndex: 99999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "900px",
          maxWidth: "95%",
          maxHeight: "80vh",
          overflowY: "auto",
          margin: "40px auto",
          padding: "30px",
          borderRadius: "8px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            border: 0,
            background: "none",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          ✕
        </button>

        <h2>Certificates</h2>

        {loading && <p style={{ color: "#777" }}>Loading...</p>}

        {!loading && files.length === 0 && (
          <p style={{ color: "#777" }}>No certificates found.</p>
        )}

        {files.map((file: any) => (
          <div
            key={file.url}
            style={{
              padding: "15px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 600,
                display: "block",
              }}
            >
              {file.title}
            </a>

            <div style={{ color: "#777" }}>
              {file.filesize}
            </div>

            <div style={{ color: "#777" }}>
              {file.modified}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}