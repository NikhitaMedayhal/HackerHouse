"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import PacmanCoconut from "@/components/PacmanCoconut";

const PIXEL_FONT =
  "'Press Start 2P', 'Courier New', Courier, monospace";

// Fields the passport can't really do without — all treated as required.
const REQUIRED_FIELDS = ["name", "city", "role", "project", "github"] as const;
type RequiredField = (typeof REQUIRED_FIELDS)[number];

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

// Same as inputStyle but flags the field red so it's obvious which one
// still needs filling in.
const inputErrorStyle = {
  ...inputStyle,
  border: "2px solid #ff3b3b",
  boxShadow: "0 0 0 2px rgba(255, 59, 59, 0.35)",
};

export default function BuilderPage() {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passportRef = useRef<HTMLDivElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoPosition, setPhotoPosition] = useState({ x: 0, y: 0 });
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const photoDragStart = useRef({ x: 0, y: 0 });
  const photoStartPosition = useRef({ x: 0, y: 0 });
  const [showPassport, setShowPassport] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [zoom, setZoom] = useState(1);

  const [form, setForm] = useState({
    name: "",
    city: "",
    role: "",
    project: "",
    github: "",
    humour: false,
  });

  // Tracks which required fields are currently empty, so we can highlight
  // them and show a message instead of silently generating a blank card.
  const [errors, setErrors] = useState<Partial<Record<RequiredField, boolean>>>({});

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result as string);
      setPhotoPosition({ x: 0, y: 0 });
    };

    reader.readAsDataURL(file);
  };
  const handlePhotoPointerDown = (
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    e.preventDefault();

    setIsDraggingPhoto(true);

    photoDragStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    photoStartPosition.current = {
      x: photoPosition.x,
      y: photoPosition.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePhotoPointerMove = (
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    if (!isDraggingPhoto) return;

    const deltaX = e.clientX - photoDragStart.current.x;
    const deltaY = e.clientY - photoDragStart.current.y;

    setPhotoPosition({
      x: photoStartPosition.current.x + deltaX,
      y: photoStartPosition.current.y + deltaY,
    });
  };

  const handlePhotoPointerUp = (
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    setIsDraggingPhoto(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If this field was flagged as missing, clear that flag as soon as
    // the user types/selects something — no need to wait for re-submit.
    if (value.trim() && name in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as RequiredField];
        return next;
      });
    }
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

    const filename = `${form.name || "builder"}-passport.png`;

    // iOS Safari ignores the `download` attribute on <a> tags — it just
    // opens the image instead of saving it. Web Share (when available)
    // gives mobile users a real "Save Image" option instead.
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "My Hacker House Passport" });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // user cancelled
        // otherwise fall through to the normal download below
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareToX = async () => {
    setIsPosting(true);

    // Mobile Safari blocks window.open() unless it happens synchronously
    // inside the click handler. Opening a blank tab now — before any
    // `await` — and redirecting it once the upload finishes keeps it
    // inside that user-gesture window instead of getting silently blocked.
    const popup = window.open("", "_blank");

    try {
      const blob = await capturePassportBlob();
      if (!blob) {
        popup?.close();
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

      if (popup) {
        popup.location.href = xUrl;
      } else {
        // Popup was blocked anyway (e.g. user has strict settings) — try a
        // direct open as a last resort.
        window.open(xUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      popup?.close();
      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Something went wrong while preparing your passport:\n\n${message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSubmit = () => {
    const newErrors: Partial<Record<RequiredField, boolean>> = {};

    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowPassport(false);
      return;
    }

    setErrors({});
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
            {/* CHARACTER REGISTRATION */}

            <div
              style={{
                fontSize: "18px",
                color: "#f7c948",
                textAlign: "center",
                marginBottom: "12px",
                lineHeight: 1.4,
                letterSpacing: "1px",
              }}
            >
              CHARACTER REGISTRATION
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "#fff",
                textAlign: "center",
                lineHeight: 1.8,
                marginBottom: "25px",
              }}
            ></div>
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
            style={errors.name ? inputErrorStyle : inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            Where do you spawn?
          </label>

          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            style={errors.country ? inputErrorStyle : inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            What are you suspiciously good at?
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={errors.role ? inputErrorStyle : inputStyle}
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
            style={errors.project ? inputErrorStyle : inputStyle}
          />

          <label style={{ fontSize: "11px", lineHeight: 1.8 }}>
            GitHub(Humans asking 🧍🏽‍♀️, I gotta give them something)
          </label>

          <input
            type="text"
            name="github"
            value={form.github}
            onChange={handleChange}
            style={errors.github ? inputErrorStyle : inputStyle}
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
                I LOVE HUMANS
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

          {Object.keys(errors).length > 0 && (
            <div
              style={{
                marginTop: "10px",
                marginBottom: "-4px",
                padding: "10px 12px",
                background: "#3a0000",
                border: "2px solid #ff3b3b",
                color: "#ffb3b3",
                fontSize: "9px",
                lineHeight: 1.6,
                textAlign: "center",
              }}
            >
              Fill in the highlighted fields first, human.
            </div>
          )}

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

          <PacmanCoconut />
        </div>

        {/* ================= PASSPORT ================= */}

        <style jsx>{`
          @media (max-width: 480px) {
            input,
            select {
              font-size: 16px !important;
            }
          }
        `}</style>

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
                  color: "#ff4f9a",
                  position: "relative",
                }}
              >

                {/* GOA PIXEL SCENE */}
                <img
                  src="/goa.png"
                  alt="Goa pixel art"
                  style={{
                    position: "absolute",
                    right: "-40px",
                    bottom: "-15px",
                    width: "500px",
                    height: "auto",
                    imageRendering: "pixelated",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />
                {/* STAMP */}
                <img
                  src="/stamp.png"
                  alt=""
                  style={{
                    position: "absolute",
                    right: "-40px",
                    top: "40px",
                    width: "200px",
                    height: "115px",
                    imageRendering: "pixelated",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
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
                    flexWrap: "wrap",
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
                      position: "relative",
                      touchAction: "none",
                    }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt="Builder"
                        onPointerDown={handlePhotoPointerDown}
                        onPointerMove={handlePhotoPointerMove}
                        onPointerUp={handlePhotoPointerUp}
                        onPointerCancel={handlePhotoPointerUp}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          width: "auto",
                          height: "100%",
                          maxWidth: "none",
                          transform: `translate(-50%, -50%) translate(${photoPosition.x}px, ${photoPosition.y}px) scale(${zoom})`,
                          cursor: isDraggingPhoto ? "grabbing" : "grab",
                          userSelect: "none",
                          touchAction: "none",
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

            {/* ZOOM CONTROL — OUTSIDE THE ID CARD */}

            {photo && (
              <div
                style={{
                  marginTop: "12px",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontFamily: PIXEL_FONT,
                    color: "#ff4f9a",
                    marginBottom: "4px",
                    letterSpacing: "1px",
                  }}
                >
                  POSITION YOUR HUMAN
                </div>

                <div
                  style={{
                    fontSize: "7px",
                    fontFamily: PIXEL_FONT,
                    color: "#fff",
                    marginBottom: "6px",
                    letterSpacing: "0.5px",
                  }}
                >
                  DRAG TO FRAME • SLIDE TO ZOOM
                </div>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{
                    width: "160px",
                    accentColor: "#ff4f9a",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}

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
                  fontSize: "9px",
                  lineHeight: 1.8,
                  color: "#ff4f9a",
                  marginBottom: "10px",
                }}
              >
                PLAYER REGISTERED.
              </div>

              <div
                style={{
                  fontSize: "8px",
                  lineHeight: 2,
                  marginBottom: "12px",
                }}
              >
                CONGRATS. YOU DID IT.
                <br />
                I SUPPOSE YOU'RE
                <br />
                OFFICIALLY A PLAYER NOW.
              </div>

              <div
                style={{
                  fontSize: "7px",
                  lineHeight: 2,
                  color: "#f7c948",
                  marginBottom: "12px",
                }}
              >
                MISSION: HACKER HOUSE
                <br />
                LOCATION: GOA
                <br />
                STATUS: UNLOCKED
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
    </main >
  );
}