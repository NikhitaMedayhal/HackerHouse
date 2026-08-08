"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";

const PIXEL_FONT =
  "'Press Start 2P', 'Courier New', Courier, monospace";

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  marginBottom: "18px",
  border: "2px solid black",
  borderRadius: "4px",
  boxSizing: "border-box" as const,
  fontFamily: PIXEL_FONT,
  fontSize: "10px",
};

export default function BuilderPage() {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passportRef = useRef<HTMLDivElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showPassport, setShowPassport] = useState(false);

  const [form, setForm] = useState({
    name: "",
    country: "",
    role: "",
    project: "",
    github: "",
  });

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Moved out of handleDownload so it can be used by the "POST ON X" button
  const postToX = () => {
    const message = `I just got my Hacker House Goa 2026 Builder Passport! 🌴💻

I'm joining the builders heading to Goa!

#HackerHouseGoa #HHGoa #BuildInPublic`;

    const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(
      message
    )}`;

    window.open(xUrl, "_blank", "noopener,noreferrer");
  };

  // Renamed handler used by the "DOWNLOAD ID" button (was calling an
  // undefined `downloadPassport` before)
  const handleDownload = async () => {
    if (!passportRef.current) return;

    const canvas = await html2canvas(passportRef.current, {
      scale: 3,
      backgroundColor: "#f7c948",
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `${form.name || "builder"}-passport.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSubmit = () => {
    setShowPassport(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0B6B3A",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 20px",
        fontFamily: PIXEL_FONT,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* ================= FORM ================= */}

        <div
          style={{
            width: "100%",
            background: "#128C52",
            padding: "30px",
            border: "4px solid black",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "25px",
              fontFamily: PIXEL_FONT,
              fontSize: "16px",
              lineHeight: 1.6,
            }}
          >
            Builder Information
          </h1>

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            Country
          </label>

          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option>Builder</option>
            <option>Developer</option>
            <option>Designer</option>
            <option>Founder</option>
            <option>Student</option>
          </select>

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            Project Name
          </label>

          <input
            type="text"
            name="project"
            value={form.project}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            GitHub
          </label>

          <input
            type="text"
            name="github"
            value={form.github}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* PHOTO UPLOAD */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#ffd700",
                marginBottom: "8px",
                fontWeight: "bold",
                fontSize: "11px",
                lineHeight: 1.8,
              }}
            >
              Upload your photo
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "10px 16px",
                  background: "#f7c948",
                  border: "3px solid black",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "10px",
                  boxShadow: "3px 3px 0 black",
                }}
              >
                Choose File
              </button>

              <span
                style={{
                  fontSize: "9px",
                  color: "#ffd700",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "140px",
                }}
              >
                {fileName || "No file chosen"}
              </span>
            </div>
          </div>

          {/* GENERATE BUTTON */}

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "12px",
              background: "#f7c948",
              border: "3px solid black",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "11px",
              fontFamily: PIXEL_FONT,
              boxShadow: "4px 4px 0 black",
            }}
          >
            Generate Passport
          </button>
        </div>

        {/* ================= PASSPORT ================= */}

        {showPassport && (
          <>
            {/* ID CARD */}
            <div
              ref={passportRef}
              style={{
                border: "3px solid #0B6B3A",
                padding: "15px",
                background: "#ffe58a",
                boxSizing: "border-box",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  background: "#f7c948",
                  border: "3px solid black",
                  padding: "15px",
                }}
              >
                {/* HEADER */}

                <div
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    marginBottom: "18px",
                  }}
                >
                  HACKER HOUSE
                  <br />
                  GOA • 2026
                </div>

                {/* PHOTO + DETAILS */}

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* PHOTO */}

                  <div
                    style={{
                      width: "90px",
                      height: "110px",
                      border: "3px solid black",
                      background: "#128C52",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt="Builder"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          imageRendering: "pixelated",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "8px",
                          textAlign: "center",
                        }}
                      >
                        PHOTO
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}

                  <div
                    style={{
                      fontSize: "9px",
                      lineHeight: 2,
                      wordBreak: "break-word",
                    }}
                  >
                    <strong>NAME</strong>
                    <br />
                    {form.name || "—"}

                    <br />

                    <strong>COUNTRY</strong>
                    <br />
                    {form.country || "—"}

                    <br />

                    <strong>ROLE</strong>
                    <br />
                    {form.role || "—"}
                  </div>
                </div>

                {/* PROJECT */}

                <div
                  style={{
                    marginTop: "15px",
                    paddingTop: "10px",
                    borderTop: "2px dashed black",
                    fontSize: "9px",
                    lineHeight: 2,
                    wordBreak: "break-word",
                  }}
                >
                  <strong>PROJECT</strong>
                  <br />
                  {form.project || "—"}

                  <br />
                  <br />

                  <strong>GITHUB</strong>
                  <br />
                  {form.github || "—"}
                </div>
              </div>

              {/* FOOTER */}

              <div
                style={{
                  marginTop: "15px",
                  textAlign: "center",
                  fontSize: "8px",
                  letterSpacing: "2px",
                }}
              >
                BUILDER PASSPORT • GOA 2026
              </div>
            </div>

            {/* ================= BUTTONS ================= */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              {/* DOWNLOAD */}

              <button
                onClick={handleDownload}
                style={{
                  flex: 1,
                  minWidth: "150px",
                  padding: "12px",
                  background: "#f7c948",
                  color: "#000",
                  border: "3px solid black",
                  boxShadow: "4px 4px 0 black",
                  fontFamily: PIXEL_FONT,
                  fontSize: "9px",
                  cursor: "pointer",
                }}
              >
                ↓ DOWNLOAD ID
              </button>

              {/* POST ON X */}

              <button
                onClick={postToX}
                style={{
                  flex: 1,
                  minWidth: "150px",
                  padding: "12px",
                  background: "#000",
                  color: "#fff",
                  border: "3px solid #0B6B3A",
                  boxShadow: "4px 4px 0 #0B6B3A",
                  fontFamily: PIXEL_FONT,
                  fontSize: "9px",
                  cursor: "pointer",
                }}
              >
                𝕏 POST ON X
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}