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
  const [isPosting, setIsPosting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    role: "",
    project: "",
    github: "",
    humour : false,
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

  const TWEET_MESSAGE = `I just got my character card uh no no sorry AHEM, my ID for Hacker House Goa 2026!

You can go get one too 👾❤️ YOU BETTER GET ONE 👹 (I heard humans use threatening so 💖 :0)

#HackerHouseGoa #FrameInGoa #ILoveHumans

~🧍🏽‍♀️(maybe)`
;

  const capturePassportBlob = async (): Promise<Blob | null> => {
    if (!passportRef.current) return null;

    const canvas = await html2canvas(passportRef.current, {
      scale: 3,
      backgroundColor: "#f7c948",
      useCORS: true,
    });

    return new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
  };

  const handleDownload = async () => {
    const blob = await capturePassportBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${form.name || "builder"}-passport.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareToX = async () => {
    setIsPosting(true);
    try {
      const blob = await capturePassportBlob();
      if (!blob) {
        alert("Could not generate your passport image.");
        return;
      }

      const body = new FormData();
      body.append("image", blob, "builder-passport.png");

      const res = await fetch("/api/passport", { method: "POST", body });
      const resJson = await res.json();

      if (!res.ok) {
        throw new Error(resJson?.error || `Upload failed (${res.status})`);
      }

      const shareUrl = `${window.location.origin}/share/${resJson.id}`;

      const xUrl =
        `https://x.com/intent/post?text=` +
        encodeURIComponent(`${TWEET_MESSAGE}\n\n${shareUrl}`);

      window.open(xUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Something went wrong while preparing your passport:\n\n${message}`);
    } finally {
      setIsPosting(false);
    }
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
            Enter your information for your own character card, or what them humans call ID
          </h1>

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            What do humans call you?
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            Where are you from?
          </label>

          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            What are you suspiciously good at?
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
            Name the crew you're bringing to Goa.
          </label>

          <input
            type="text"
            name="project"
            value={form.project}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            GitHub(Humans asking 🧍🏽‍♀️, I gotta give them something)
          </label>

          <input
            type="text"
            name="github"
            value={form.github}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* ================= SENSE OF HUMOUR ================= */}

<div
  style={{
    marginTop: "5px",
    marginBottom: "20px",
    padding: "14px",
    background: "#0B6B3A",
    border: "3px solid black",
    boxShadow: "4px 4px 0 black",
  }}
>
  <label
    style={{
      display: "block",
      color: "#f7c948",
      fontSize: "9px",
      lineHeight: 1.8,
      marginBottom: "8px",
    }}
  >
    SENSE OF HUMOUR
  </label>

  <label
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "8px",
      cursor: "pointer",
      color: "#ffe58a",
      fontSize: "10px",
      lineHeight: 1.8,
    }}
  >
    <input
      type="checkbox"
      checked={form.humour}
      onChange={(e) =>
        setForm({
          ...form,
          humour: e.target.checked,
        })
      }
      style={{
        width: "16px",
        height: "16px",
        accentColor: "#ff4f9a",
        flexShrink: 0,
      }}
    />

    <span>
      I LOVE HUMANS 😃
      <br />
      <span
        style={{
          color: "#ff4f9a",
          fontSize: "10px",
        }}
      >
        Select this if you read all the captions and showed your teeth 🦷.
      </span>
    </span>
  </label>
</div>

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
              Submit visual evidence of your existence.
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
            Generate ID (IN HUMAN LANGUAGE, 'CAUSE THEY'RE SUPRISINGLY INCOMPETENT FOR THEY HAVE VERY HIGH STANDARDS)
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
                color: "#ff4f9a"
              }}
            >
              <div
                style={{
                  background: "#f7c948",
                  border: "3px solid black",
                  padding: "15px",
                  color: "#ff4f9a"
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

                    <strong>CITY</strong>
                    <br />
                    {form.city || "—"}

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
                BUILDER CARD • GOA 2026
              </div>
            </div>

                        {/* ================= CONGRATULATIONS ================= */}

        <div
          style={{
            marginTop: "25px",
            marginBottom: "20px",
            padding: "16px",
            background: "#128C52",
            border: "3px solid black",
            boxShadow: "5px 5px 0 black",
            textAlign: "center",
            color: "#ffe58a",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              lineHeight: 1.8,
              color: "#ff4f9a",
              marginBottom: "10px",
            }}
          >
            CONGRATS. YOU DID IT.
          </div>

          <div
            style={{
              fontSize: "8px",
              lineHeight: 2,
              marginBottom: "12px",
            }}
          >
            I SUPPOSE YOU'RE
            <br />
            OFFICIALLY A PERSON NOW.
          </div>

          <div
            style={{
              fontSize: "9px",
              lineHeight: 1.8,
              color: "#f7c948",
            }}
          >
            NOW GO SHOW 'EM
            <br />
            WHO OWNS THIS PLACE.
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
                onClick={shareToX}
                disabled={isPosting}
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
                  cursor: isPosting ? "default" : "pointer",
                  opacity: isPosting ? 0.6 : 1,
                }}
              >
                {isPosting ? "PREPARING…" : "𝕏 POST ON X"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}